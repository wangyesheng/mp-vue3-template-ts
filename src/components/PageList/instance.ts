import type { ComponentPublicInstance } from 'vue'

/**
 * 与 PageList 的 defineExpose({ refresh, getData }) 一致。
 * 模板里 :ref 回调拿到的是 `Element | ComponentPublicInstance | null`，需经 setPageListRef 收敛。
 */
export interface PageListInstance extends ComponentPublicInstance {
  refresh: () => Promise<void>
  getData: () => []
  getSelectedKeys: () => []
}

/** 需要挂上 PageList 实例的对象（例如 Tab 项），必须传「对象」才能在内部执行 holder.instance = el */
export interface PageListInstanceHolder {
  instance: PageListInstance | null
}

/**
 * 必须传入「带 instance 字段的对象」，不能传 item.instance：
 * 传 item.instance 只是传了一个当前值，函数里无法给父级的 item.instance 赋值。
 */
export function setPageListRef(
  holder: PageListInstanceHolder,
  el: Element | ComponentPublicInstance | null,
): void {
  holder.instance = el as PageListInstance | null
}
