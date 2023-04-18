import { SiGithub } from 'react-icons/si'
import { Button } from './Button'
import { IconWrapper } from './IconWrapper'
import { Tag } from './Tag'

interface ProjectCardProps {
  title: string
  description: string
  image: string
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { title, description } = props

  return (
    <div className="relative p-5 backdrop-blur-sm rounded-lg overflow-hidden w-full md:w-80 bg-[#1a1b1c] text-white shadow-lg shadow-gray-600">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-sm font-normal text-gray-200">{description}</p>

      <div>
        <Button
          variant="outline"
          href=""
          type="anchor"
          icon={<IconWrapper iconProps={{ icon: <SiGithub />, size: 'xl' }} />}
          border={false}
        />
      </div>

      <div className="flex gap-3 mt-3 flex-wrap">
        <Tag text="React" variant="blue" />
        <Tag text="Next.js" variant="green" />
        <Tag text="Next.js" variant="orange" />
        <Tag text="Next.js" variant="violet" />
      </div>
    </div>
  )
}
