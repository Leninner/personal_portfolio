import { memo } from 'react'
import { COLORS } from '../constants/appEnums'

interface TagProps {
  text: string
  variant: keyof typeof COLORS
}

const Tag = (props: TagProps) => {
  const { text, variant = 'blue' } = props

  const [textColor, background] = [
    COLORS[variant].text,
    COLORS[variant].background,
  ]

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium leading-4 ${textColor} ${background} rounded-full bg-opacity-10 font-sans`}
    >
      {text}
    </span>
  )
}

export const TagMemo = memo(Tag)
