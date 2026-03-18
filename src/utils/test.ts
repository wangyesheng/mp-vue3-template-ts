/**
 * 验证电子邮箱格式
 */
function email(value: string): boolean {
  return /[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/.test(value)
}

/**
 * 验证手机格式
 */
function mobile(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 验证URL格式
 */
function url(value: string): boolean {
  return /https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w./?%&=-]*)?/.test(value)
}

/**
 * 验证日期格式
 */
function date(value: string | Date): boolean {
  return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 验证ISO类型的日期格式
 */
function dateISO(value: string): boolean {
  return /^\d{4}[/-](?:0?[1-9]|1[012])[/-](?:0?[1-9]|[12]\d|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
function number(value: string | number): boolean {
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+|\d\.\d+e\+\d+)$/.test(String(value))
}

/**
 * 验证整数
 */
function digits(value: string | number): boolean {
  return /^\d+$/.test(String(value))
}

/**
 * 验证身份证号码
 */
function idCard(value: string): boolean {
  return /^[1-9]\d{5}[1-9]\d{3}(?:0\d|1[0-2])(?:[0|12]\d|3[01])\d{3}[0-9X]$/.test(value)
}

/**
 * 是否车牌号
 */
function carNo(value: string): boolean {
  // 新能源车牌
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z](?:\d{5}[DF]$|[DF][A-HJ-NP-Z0-9]\d{4}$)/
  // 旧车牌
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$/
  if (value.length === 7) {
    return creg.test(value)
  }
  else if (value.length === 8) {
    return xreg.test(value)
  }
  else {
    return false
  }
}

/**
 * 金额，只允许2位小数
 */
function amount(value: string | number): boolean {
  return /^[1-9]\d*(?:,\d{3})*(?:\.\d{1,2})?$|^0\.\d{1,2}$/.test(String(value))
}

/**
 * 中文
 */
function chinese(value: string): boolean {
  return /^[\u4E00-\u9FA5]+$/.test(value)
}

/**
 * 只能输入字母
 */
function letter(value: string): boolean {
  return /^[a-z]*$/i.test(value)
}

/**
 * 只能是字母或者数字
 */
function enOrNum(value: string): boolean {
  return /^[0-9a-z]*$/i.test(value)
}

/**
 * 验证是否包含某个值
 */
function contains(value: string, param: string): boolean {
  return value.includes(param)
}

/**
 * 验证一个值范围 [min, max]
 */
function range(value: number, param: [number, number]): boolean {
  return value >= param[0] && value <= param[1]
}

/**
 * 验证一个长度范围 [min, max]
 */
function rangeLength(value: string | unknown[], param: [number, number]): boolean {
  return value.length >= param[0] && value.length <= param[1]
}

/**
 * 是否固定电话
 */
function landline(value: string): boolean {
  return /^\d{3,4}-\d{7,8}(?:-\d{3,4})?$/.test(value)
}

/**
 * 判断是否为空
 */
function empty(value: unknown): boolean {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'string':
      if ((value as string).replace(/^[ \t\n\r]*|[ \t\n\r]*$/g, '').length === 0) {
        return true
      }
      break
    case 'boolean':
      if (!value) {
        return true
      }
      break
    case 'number':
      if (value === 0 || Number.isNaN(value as number)) {
        return true
      }
      break
    case 'object':
      if (value === null || (value as any[]).length === 0) {
        return true
      }
      return Object.keys(value as object).length === 0
  }
  return false
}

/**
 * 是否 JSON 字符串
 */
function jsonString(value: unknown): boolean {
  if (typeof value === 'string') {
    try {
      const obj = JSON.parse(value)
      if (typeof obj === 'object' && obj) {
        return true
      }
      else {
        return false
      }
    }
    catch {
      return false
    }
  }
  return false
}

/**
 * 是否数组
 */
function array(value: unknown): boolean {
  return Array.isArray(value)
}

/**
 * 是否对象
 */
function object(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 是否短信验证码
 */
function code(value: string, len = 6): boolean {
  return new RegExp(`^\\d{${len}}$`).test(value)
}

export default {
  email,
  mobile,
  url,
  date,
  dateISO,
  number,
  digits,
  idCard,
  carNo,
  amount,
  chinese,
  letter,
  enOrNum,
  contains,
  range,
  rangeLength,
  empty,
  isEmpty: empty,
  jsonString,
  landline,
  object,
  array,
  code,
}
