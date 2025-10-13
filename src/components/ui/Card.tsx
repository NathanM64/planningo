import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { children, variant = 'default', padding = 'md', className = '', ...props },
    ref
  ) => {
    // Styles de base - plus nets, moins d'ombre
    const baseStyles = 'bg-white rounded-lg'

    // Variantes - palette "Soft & Modern"
    const variantStyles = {
      default: 'border border-gray-200 shadow-sm',
      primary: 'border border-blue-200 bg-blue-50',
      accent: 'border border-yellow-200 bg-yellow-50',
      success: 'border border-green-200 bg-green-50',
      bordered: 'border-2 border-gray-300',
    }

    // Padding
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Sous-composants
export const CardHeader = ({
  children,
  className = '',
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle = ({
  children,
  className = '',
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>
)

export const CardDescription = ({
  children,
  className = '',
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-gray-600 text-base ${className}`}>{children}</p>
)

export const CardContent = ({
  children,
  className = '',
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={className}>{children}</div>
)

export const CardFooter = ({
  children,
  className = '',
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
)

export default Card
