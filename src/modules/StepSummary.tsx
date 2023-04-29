import { Button } from '../components/Button'
import { CommonProps } from './Layout'

export const StepSummary = (props: CommonProps) => (
  <div
    className={`flex flex-col md:flex-row justify-between items-center w-full py-20 gap-5 ${props.extraStyle}`}
  >
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-5">
        Conóceme: La juventud eterna para equipos altamente efectivos
      </h1>

      <div className="text-xl text-gray-800">
        <p>
          Soy un profesional que combina juventud, pasión, experiencia y
          liderazgo para alcanzar mis objetivos laborales. Estas cualidades me
          permiten aportar energía y creatividad, compromiso y conocimientos,
          además de guiar a mi equipo hacia el éxito.
        </p>

        <p className="hidden md:block">
          Además, me esfuerzo por mantener buenas prácticas de programación para
          garantizar la calidad y eficiencia de cada proyecto.
        </p>
      </div>

      <Button
        text="Descubre mi CV"
        type="anchor"
        href="https://portfolio-leninsin.s3.amazonaws.com/SoftwareDeveloper_LeninMazabanda.pdf"
        extraClasses="shadow-sm shadow-[#f9ef2e77] bg-[#f9ef2e] text-[#333] py-3 px-10 mt-5 text-lg"
      />
    </div>

    <div className="flex-1 grid md:place-content-end place-content-center">
      <img
        src="https://portfolio-leninsin.s3.amazonaws.com/leninner.jpeg"
        alt="leninsin"
        className="md:w-96 md:h-96 rounded-full w-72 h-72"
      />
    </div>
  </div>
)
