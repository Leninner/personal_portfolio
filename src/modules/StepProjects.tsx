import { ProjectCard } from '../components/ProjectCard'

export const StepProjects = () => {
  const projects = [
    {
      id: 1,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
    {
      id: 2,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
    {
      id: 3,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
    {
      id: 4,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
    {
      id: 5,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
    {
      id: 6,
      title: 'Leninner',
      description: 'My personal website',
      image: '/images/leninner.png',
    },
  ]

  return (
    <section
      className="flex flex-col justify-evenly bg-gray-100 items-center md:min-h-[680px] w-full py-10 gap-5 shadow-lg shadow-[#5f5f5377]"
      id="projects"
    >
      <h1 className="md:text-3xl text-xl font-medium text-center">
        Expandiendo mis límites,{' '}
        <span className="font-bold py-5 px-2">
          aprendiendo cada día algo nuevo
        </span>
      </h1>

      <div className="flex flex-wrap gap-5 md:gap-10 justify-center md:justify-between py-10">
        {projects.map((project) => (
          <ProjectCard {...project} key={project.id} />
        ))}
      </div>
    </section>
  )
}
