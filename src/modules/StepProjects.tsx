import { useEffect, useState } from 'react'
import { ProjectCardMemo } from '../components/ProjectCard'
import { IProject } from '../services/getProjects'

export const StepProjects = () => {
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await fetch(`/api/projects`).then((res) => res.json())

      setProjects(data)
    }

    fetchPosts()
  }, [])

  return (
    <section
      className="flex flex-col py-20 gap-16 shadow-lg shadow-[#5f5f5377]"
      id="projects"
    >
      <h1 className="md:text-3xl text-xl font-medium md:w-1/2">
        Mira ya mismo mis proyectos
      </h1>

      <div className="flex gap-5 flex-wrap">
        {projects?.map((project) => (
          <ProjectCardMemo {...project} key={project.id} />
        ))}
      </div>
    </section>
  )
}
