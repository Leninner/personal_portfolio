import { GoToNextSection } from '../components/GoToNextSection'

export const StepIntroduction = () => (
  <section className="flex justify-center flex-col items-center h-screen bg-[#f9ef2e] overflow-hidden">
    <h1 className="text-6xl font-bold">Lenin Mazabanda</h1>
    <h3 className="text-4xl">Software Developer</h3>
    <p className="text-2xl font-bold">Be Kind to Yourself</p>

    <GoToNextSection extraClasses="mt-10" />
  </section>
)
