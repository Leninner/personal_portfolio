import { Button } from '../components/Button'

export const StepSummary = () => (
  <div className="h-screen flex flex-col md:flex-row justify-between items-center md:h-[680px] md:px-[8.33vw] w-full py-10 gap-5 my-10">
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-5">
        La juventud eterna para el código de tu negocio
      </h1>

      <p className="text-xl text-gray-600">
        GeneXus es la Plataforma Empresarial Low-Code para desarrollo de
        software, impulsada por Inteligencia Artificial, que simplifica y
        automatiza las tareas de creación, evolución y mantenimiento de
        aplicaciones empresariales y sistemas IT.
      </p>

      <Button
        text="Descubre GeneXus"
        type="anchor"
        href="https://www.genexus.com/"
        extraClasses="shadow-sm shadow-[#f9ef2e77] bg-[#f9ef2e] text-[#333] py-3 px-10 mt-5 text-lg"
      />
    </div>

    <div className="flex-1 grid md:place-content-end place-content-center">
      <img
        src=""
        alt=""
        className="md:w-96 md:h-96 rounded-full bg-red-400 w-72 h-72"
      />
    </div>
  </div>
)
