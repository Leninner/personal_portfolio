export interface ICardProps {
  id: string
  title: string
  date: string
  description: string
  url: string
  extraClasses?: string
}

export const Card = (props: ICardProps) => {
  const { title, date, description, url, extraClasses = '' } = props
  const cardStyles = `w-5/6 md:w-[30%] bg-white rounded-sm shadow-lg shadow-[#f9ef2e77] p-10 text-black ${extraClasses}`

  return (
    <div className={cardStyles}>
      <span className="text-gray-400 text-sm font-bold">{date}</span>
      <h1 className="font-bold text-xl">{title}</h1>
      <p className="truncate">{description}</p>

      <a
        target="_blank"
        href={url}
        className="block px-5 py-2 rounded-full text-sm font-bold mt-3 max-w-max shadow-sm shadow-[#f9ef2e77] bg-[#f9ef2e] text-[#333] hover:bg-white border-2 border-[#f9ef2e] hover:border-[#f9ef2e] hover:text-black] transition duration-300 ease-in-out "
        rel="noreferrer"
      >
        Read more
      </a>
    </div>
  )
}
