import { motion } from 'framer-motion'

interface IGoToNextSectionProps {
  extraClasses?: string
}

export const GoToNextSection = (props: IGoToNextSectionProps) => {
  const { extraClasses = '' } = props

  const clases = `relative ${extraClasses}`

  return (
    <motion.a
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.97 }}
      className={clases}
      href="#projects"
    >
      <div className="border-2 border-gray-700 text-white font-bold px-4 py-8 rounded-full"></div>
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <motion.div className="h-4 w-4 rounded-full bg-gray-900 animate-upAndDown" />
      </motion.div>
    </motion.a>
  )
}
