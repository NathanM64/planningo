import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    // Styles de base - plus épais, plus lisible
    const baseStyles =
      'w-full px-4 py-3 text-base border-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1'

    // Styles selon l'état - style "tinted"
    const stateStyles = error
      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
      : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white'

    // Ajustements pour les icônes
    const iconPaddingStyles = leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : ''

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            {label}
          </label>
        )}

        {/* Input avec icônes */}
        <div className="relative">
          {/* Icône gauche */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={`${baseStyles} ${stateStyles} ${iconPaddingStyles} ${className}`}
            {...props}
          />

          {/* Icône droite */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        )}

        {/* Texte d'aide */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
