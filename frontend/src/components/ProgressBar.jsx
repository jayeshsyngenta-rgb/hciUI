import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const steps = [
  { label: 'Select', num: 1 },
  { label: 'Suggest', num: 2 },
  { label: 'Study', num: 3 },
  { label: 'Done', num: 4 },
]

export default function ProgressBar({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 px-4">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: step.num === currentStep ? 1.1 : 1,
                transition: { type: 'spring', stiffness: 300 },
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-300
                ${step.num < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.num === currentStep
                    ? 'bg-primary border-primary text-primary-foreground shadow-md'
                    : 'bg-card border-border text-muted-foreground'
                }`}
            >
              {step.num < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                step.num
              )}
            </motion.div>
            <span
              className={`text-[11px] mt-1.5 font-medium transition-colors duration-300
                ${step.num < currentStep
                  ? 'text-green-600'
                  : step.num === currentStep
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-1 mb-5 transition-colors duration-500 rounded-full
                ${step.num < currentStep ? 'bg-green-500' : 'bg-border'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
