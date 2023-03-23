import { Card } from '../components/Card'

export const StepBlog = () => (
  <section
    className="flex flex-col justify-evenly items-center md:h-[680px] bg-[#1a1b1c] text-red-400 md:px-[8.33vw] w-full py-10 gap-5"
    id="blog"
  >
    <h1>
      Mira a tu <strong>alrededor</strong>
    </h1>

    <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-0 gap-5">
      <Card />
      <Card />
      <Card />
    </div>
  </section>
)
