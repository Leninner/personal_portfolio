type Variants = 'outline' | 'solid' | 'ghost'

interface IButtonProps {
  text?: string
  extraClasses?: string
  type?: 'button' | 'submit' | 'reset' | 'anchor'
  onClick?: () => void
  href?: string
  variant?: Variants
  canDownload?: boolean
  icon?: JSX.Element
  roundedSize?: 'small' | 'medium' | 'large'
  border?: boolean
}

export const Button = (props: IButtonProps) => {
  const { border = true } = props

  const buttonVariants = {
    outline:
      'border-yellow-primary text-[#333] hover:bg-yellow-primary hover:text-[#333] bg-white',
    solid:
      'bg-yellow-primary text-[#333] hover:border-yellow-primary hover:text-[#333] hover:bg-white',
    ghost: 'bg-transparent text-yellow-primary',
  }

  const roundedSizes = {
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  }

  const buttonClasses = `block flex px-5 py-2 text-sm font-bold mt-3 max-w-max transition duration-300 ease-in-out ${
    props.extraClasses
  } ${buttonVariants[props.variant || 'solid']} ${
    roundedSizes[props.roundedSize || 'full']
  }
  ${border ? 'border-2' : ''}
  `

  if (props.type === 'anchor') {
    return (
      <a
        href={props.href}
        className={buttonClasses}
        target="_blank"
        rel="noreferrer"
      >
        {props.icon ?? null}
        {props.text}
      </a>
    )
  }

  return (
    <button type={props.type} className={buttonClasses} onClick={props.onClick}>
      {props.icon ?? null}

      {props.text}
    </button>
  )
}
