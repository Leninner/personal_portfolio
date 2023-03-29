type Variants = 'outline' | 'solid' | 'ghost'

interface IButtonProps {
  text: string
  extraClasses?: string
  type?: 'button' | 'submit' | 'reset' | 'anchor'
  onClick?: () => void
  href?: string
  variant?: Variants
}

export const Button = (props: IButtonProps) => {
  const buttonVariants = {
    outline:
      'border-[#f9ef2e] text-[#333] hover:bg-[#f9ef2e] hover:text-[#333] bg-white',
    solid:
      'bg-[#f9ef2e] text-[#333] hover:border-[#f9ef2e] hover:text-[#333] hover:bg-white',
    ghost: 'bg-transparent text-[#f9ef2e]',
  }

  const buttonClasses = `block px-5 py-2 rounded-full text-sm font-bold mt-3 max-w-max border-2 transition duration-300 ease-in-out ${
    props.extraClasses
  } ${buttonVariants[props.variant || 'solid']}`

  if (props.type === 'anchor') {
    return (
      <a href={props.href} className={buttonClasses}>
        {props.text}
      </a>
    )
  }

  return (
    <button type={props.type} className={buttonClasses} onClick={props.onClick}>
      {props.text}
    </button>
  )
}
