// src/utils/offlineSubmit.ts
interface OfflineTask {
  id: string // 本地任务 id
  status: 'pending' | 'running'
  idempotencyKey: string // 幂等键：防重复提交
  createdAt: number
  payload: {
    form: Record<string, any>
    // 注意：这里只存“本地图片路径”，不是图片内容
    localPhotoPaths: string[]
  }
}

const STORAGE_KEY = 'OFFLINE_QUEUE_V1'

function loadQueue(): OfflineTask[] {
  return (uni.getStorageSync(STORAGE_KEY) || []) as OfflineTask[]
}

function saveQueue(list: OfflineTask[]) {
  uni.setStorageSync(STORAGE_KEY, list)
}

function uid(prefix = 't') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

async function isOnline(): Promise<boolean> {
  const res = await uni.getNetworkType()
  return res.networkType !== 'none'
}

// 关键：把临时图片变成“可长期存在”的本地文件（断网/重启也还在）
async function persistImage(tempPath: string): Promise<string> {
  // 1) 压缩（可选但强烈建议）
  const compressed = await new Promise<string>((resolve, reject) => {
    uni.compressImage({
      src: tempPath,
      quality: 70,
      success: (r) => resolve(r.tempFilePath),
      fail: reject,
    })
  })

  // 2) 保存到本地文件系统（返回 savedFilePath，稳定）
  const saved = await new Promise<string>((resolve, reject) => {
    uni.saveFile({
      tempFilePath: compressed,
      success: (r) => resolve(r.savedFilePath),
      fail: reject,
    })
  })

  return saved
}

// 示例：上传到你自己的后端（返回 fileKey）
async function uploadOne(savedFilePath: string): Promise<string> {
  const resp = await new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
    uni.uploadFile({
      url: 'https://api.example.com/files/upload',
      filePath: savedFilePath,
      name: 'file',
      timeout: 60_000,
      success: resolve,
      fail: reject,
    })
  })

  const data = JSON.parse(resp.data || '{}')
  if (!data.fileKey) throw new Error('upload failed: no fileKey')
  return data.fileKey as string
}

// 业务提交：带幂等键，重复提交也只会生效一次
async function submitForm(form: Record<string, any>, fileKeys: string[], idempotencyKey: string) {
  return await uni.request({
    url: 'https://api.example.com/workorders/submit',
    method: 'POST',
    timeout: 30_000,
    header: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    data: {
      ...form,
      photos: fileKeys,
    },
  })
}

function removeTask(taskId: string) {
  const list = loadQueue().filter((t) => t.id !== taskId)
  saveQueue(list)
}

function markRunning(taskId: string) {
  const list = loadQueue().map((t) => (t.id === taskId ? { ...t, status: 'running' } : t))
  saveQueue(list as OfflineTask[])
}

// 入口：提交按钮调用它
export async function submitWithOfflineQueue(form: Record<string, any>, tempPhotoPaths: string[]) {
  // 1) 先把图片“持久化保存”，避免 tempFilePath 被系统清理
  const localPhotoPaths: string[] = []
  for (const p of tempPhotoPaths) {
    localPhotoPaths.push(await persistImage(p))
  }

  // 2) 入队（storage 只存任务元数据 + 本地路径，不存图片内容）
  const task: OfflineTask = {
    id: uid('task'),
    status: 'pending',
    idempotencyKey: uid('idem'),
    createdAt: Date.now(),
    payload: { form, localPhotoPaths },
  }

  const list = loadQueue()
  list.push(task)
  saveQueue(list)

  // 3) 如果当前有网，顺手触发一次 worker（没网也没关系，队列还在）
  if (await isOnline()) {
    void runOfflineWorkerOnce()
  }

  return { queued: true, taskId: task.id }
}

// Worker：一次处理一个任务（简单好理解）
export async function runOfflineWorkerOnce() {
  if (!(await isOnline())) return

  const list = loadQueue()
  const task = list.find((t) => t.status === 'pending')
  if (!task) return

  try {
    markRunning(task.id)

    // 先上传图片（弱网失败就下次再来；任务还在）
    const fileKeys: string[] = []
    for (const localPath of task.payload.localPhotoPaths) {
      fileKeys.push(await uploadOne(localPath))
    }

    // 再提交业务表单（带幂等键，重复调用也安全）
    const res = await submitForm(task.payload.form, fileKeys, task.idempotencyKey)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // 成功：移除任务 + 清理本地图片（省空间）
      removeTask(task.id)
      for (const localPath of task.payload.localPhotoPaths) {
        try {
          uni.getFileSystemManager().unlink({ filePath: localPath })
        } catch {}
      }
    } else {
      // 失败：把状态改回 pending，等下次网络好了再跑
      const rollback = loadQueue().map((t) => (t.id === task.id ? { ...t, status: 'pending' } : t))
      saveQueue(rollback as OfflineTask[])
    }
  } catch {
    const rollback = loadQueue().map((t) => (t.id === task.id ? { ...t, status: 'pending' } : t))
    saveQueue(rollback as OfflineTask[])
  }
}

// 建议在 App 启动时调用：网络恢复就自动补交
export function startOfflineWorker() {
  // 启动先跑一次
  void runOfflineWorkerOnce()

  // 网络从无到有时再跑
  uni.onNetworkStatusChange((r) => {
    if (r.isConnected) void runOfflineWorkerOnce()
  })

  // 也可以加个轻量定时（避免漏事件）
  setInterval(() => void runOfflineWorkerOnce(), 10_000)
}
