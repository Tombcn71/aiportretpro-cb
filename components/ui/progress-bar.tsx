import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-[#0077B5] h-3 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
