import { IconWrapper } from '../components/IconWrapper'
import { ICONS } from '../constants/icons'

export const StepSkills = () => (
  <section
    className={`flex flex-col justify-center items-center bg-gray-100 w-full py-20 gap-5 text-center`}
  >
    <h1 className="md:text-3xl text-xl font-bold text-[#333]">
      ¡Habilidades clave para el éxito en el mundo actual!
    </h1>

    <div className="flex flex-wrap gap-20 justify-center m-10">
      {Object.keys(ICONS).map((key: string, index: number) => (
        <IconWrapper iconProps={ICONS[key as keyof typeof ICONS]} key={index} />
      ))}
    </div>
  </section>
)
