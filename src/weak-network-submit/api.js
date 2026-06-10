// // Koa 示例：/workorders/submit
// router.post('/workorders/submit', async (ctx) => {
//   const idemKey = ctx.get('Idempotency-Key')
//   if (!idemKey) ctx.throw(400, 'Missing Idempotency-Key')

//   const cacheKey = `idem:${idemKey}`
//   const cached = await redis.get(cacheKey)
//   if (cached) {
//     ctx.set('X-Idempotent-Replay', '1')
//     ctx.body = JSON.parse(cached)
//     return
//   }

//   // 正常执行业务（落库、生成工单等）
//   const result = await createWorkOrder(ctx.request.body)

//   // 把结果缓存一段时间（比如 24h）
//   await redis.set(cacheKey, JSON.stringify(result), 'EX', 24 * 3600)

//   ctx.body = result
// })
