export type InvoiceTypeKey = 0 | 1 | 2 | 3

export interface InvoiceType {
  key: InvoiceTypeKey
  label: string
  type: string
}

export const INVOICE_TYPES: InvoiceType[] = [
  { key: 0, label: '未开票', type: 'wait' },
  { key: 1, label: '已开票', type: 'done' },
  { key: 2, label: '已确认', type: 'confirm' },
  { key: 3, label: '已驳回', type: 'reject' },
]

export const INVOICE_MAP = INVOICE_TYPES.reduce<Record<string, InvoiceType>>((memo, current) => {
  memo[current.key] = current as InvoiceType
  return memo
}, {})
