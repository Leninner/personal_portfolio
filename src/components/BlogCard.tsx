import { DateUtils } from '../utils/Date'

export interface ICardProps {
  guid: string
  title: string
  pubDate: string
  link: string
  extraClasses?: string
}

export const Card = (props: ICardProps) => {
  const { title, pubDate, link, extraClasses = '' } = props
  const cardStyles = `w-full bg-white rounded-md p-5 text-black border-l-8 border border-yellow-primary cursor-pointer ${extraClasses}`

  const goToPost = () => {
    window.open(link, '_blank')
  }

  return (
    <div className={cardStyles} onClick={goToPost}>
      <span className="text-gray-400 text-sm font-bold">
        {DateUtils.normalize(pubDate)}
      </span>

      <h1 className="font-medium text-xl my-5">{title}</h1>
    </div>
  )
}
