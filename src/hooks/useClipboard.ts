import Taro from '@tarojs/taro'

import { useCallback, useState } from 'react'

type Options = {
  toast?: boolean
  toastText?: string
}

/**
 * 文本复制
 * @param opts
 */
export function useClipboard(opts: Options = {}) {
  const { toast = true, toastText = '已复制' } = opts
  const [last, setLast] = useState<string>('')

  const copy = useCallback(
    async (text: string) => {
      await Taro.setClipboardData({ data: text })
      setLast(text)

      // 微信端 setClipboardData 通常会自带提示；这里做可控 toast（你也可关）
      if (toast) {
        try {
          await Taro.showToast({ title: toastText, icon: 'none', duration: 1500 })
        } catch {}
      }
    },
    [toast, toastText]
  )

  const read = useCallback(async () => {
    const res = await Taro.getClipboardData()
    setLast(res.data || '')
    return res.data || ''
  }, [])

  return { copy, read, last }
}
