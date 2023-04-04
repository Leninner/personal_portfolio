import { DateUtils } from '../utils/Date'
import { Button } from './Button'

export interface ICardProps {
  guid: string
  title: string
  pubDate: string
  link: string
  extraClasses?: string
}

export const Card = (props: ICardProps) => {
  const { title, pubDate, link, extraClasses = '' } = props
  const cardStyles = `w-full md:w-[30%] bg-white rounded-sm shadow-md shadow-[#f9ef2e77] p-10 text-black ${extraClasses}`

  return (
    <div className={cardStyles}>
      <span className="text-gray-400 text-sm font-bold">
        {DateUtils.normalize(pubDate)}
      </span>

      <h1 className="font-medium text-xl my-5">{title}</h1>

      <Button
        text="Read more"
        extraClasses="shadow-sm shadow-[#f9ef2e77] bg-[#f9ef2e] text-[#333]"
        type="anchor"
        href={link}
      />
    </div>
  )
}
