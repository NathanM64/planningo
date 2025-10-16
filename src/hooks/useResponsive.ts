import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

interface ResponsiveState {
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

/**
 * Hook pour détecter les breakpoints responsive
 *
 * Breakpoints:
 * - mobile: < 1024px
 * - tablet: 1024-1279px
 * - desktop: >= 1280px
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR-safe: valeur par défaut desktop
    if (typeof window === 'undefined') {
      return {
        breakpoint: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1280,
      }
    }

    const width = window.innerWidth
    const breakpoint: Breakpoint =
      width < 1024 ? 'mobile' :
      width < 1280 ? 'tablet' :
      'desktop'

    return {
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
      width,
    }
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const breakpoint: Breakpoint =
        width < 1024 ? 'mobile' :
        width < 1280 ? 'tablet' :
        'desktop'

      setState({
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
        width,
      })
    }

    // Débounce pour éviter trop de re-renders
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)

    // Appeler handleResize au montage pour s'assurer de la valeur correcte
    handleResize()

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [])

  return state
}
