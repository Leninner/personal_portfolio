import { IconContext } from 'react-icons'

interface IconWrapperProps {
  iconProps: {
    icon: JSX.Element
    name: string
    link?: string
  }
}

export const IconWrapper = ({ iconProps }: IconWrapperProps) => {
  const { icon, name, link } = iconProps

  return (
    <IconContext.Provider
      value={{
        // size: '10em',
        // color: '#f9ef2e',
        className: 'text-5xl ',
      }}
    >
      <div
        className="flex flex-col gap-5 text-lg text-[#242a26] items-center hover:text-[#424627] font-medium cursor-pointer"
        onClick={() => {
          if (link) {
            window.open(link, '_blank')
          }
        }}
      >
        {icon}
        <p>{name}</p>
      </div>
    </IconContext.Provider>
  )
}
