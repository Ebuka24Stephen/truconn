import * as React from 'react'

import { cn } from '@/lib/utils'

type Step = {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (index: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepChange, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          return (
            <li key={step.id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onStepChange?.(index)}
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                  isCompleted && 'border-emerald-500 text-emerald-400 bg-emerald-500/20',
                  isActive && 'border-purple-500 text-purple-400 bg-purple-500/20',
                  !isActive && !isCompleted && 'border-purple-900/30 text-gray-500'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : index + 1}
              </button>
              <div>
                <div className={cn('text-sm font-semibold', isActive ? 'text-purple-300' : 'text-gray-400')}>{step.title}</div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
