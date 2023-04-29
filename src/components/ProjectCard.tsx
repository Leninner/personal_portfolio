import { SiGithub } from 'react-icons/si'
import { Button } from './Button'
import { IconWrapper } from './IconWrapper'
import { TagMemo } from './Tag'
import { IProject } from '../services/getProjects'
import { COLORS } from '../constants/appEnums'
import { memo } from 'react'

const ProjectCard = (props: IProject) => {
  const { name, description, stack } = props

  return (
    <div className="relative p-5 backdrop-blur-sm rounded-lg overflow-hidden w-full md:w-80 bg-[#1a1b1c] text-white shadow-lg shadow-gray-600 flex flex-col justify-between">
      <h3 className="text-xl font-medium">{name}</h3>
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
        {stack?.map((tag) => (
          <TagMemo
            text={tag}
            variant={
              `${
                Object.keys(COLORS)[
                  Math.floor(Math.random() * Object.keys(COLORS).length)
                ]
              }` as keyof typeof COLORS
            }
            key={tag}
          />
        ))}
      </div>
    </div>
  )
}

export const ProjectCardMemo = memo(ProjectCard)
