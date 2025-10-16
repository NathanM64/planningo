'use client'

import { ReactNode, useState } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

/**
 * Composant Tooltip accessible
 * Affiche une info-bulle au survol ou au focus clavier
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-px border-4 border-transparent border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-px border-4 border-transparent border-r-gray-900',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2
            bg-gray-900 text-white text-sm rounded-lg
            whitespace-nowrap shadow-lg
            animate-in fade-in duration-150
            ${positionClasses[position]}
          `}
        >
          {content}

          {/* Flèche */}
          <div
            className={`absolute ${arrowClasses[position]}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}
