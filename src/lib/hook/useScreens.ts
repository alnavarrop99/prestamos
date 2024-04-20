import { useEffect, useState } from 'react'
import { screens } from 'tailwindcss/defaultTheme'

/* eslint-disable-next-line */
type TScreen = 'sm' | 'md' | 'lg'

/* eslint-disable-next-line */
type TUseScreens = () => TScreen

/* eslint-disable-next-line */
export const useScreen: TUseScreens = () => {
  const [theme, setTheme] = useState<TScreen>('sm')
  useEffect(() => {
    const onChange = () => {
      if (window.innerWidth >= +screens.md?.replace(/px/g, '')) {
        setTheme('md')
      }

      if (window.innerWidth >= +screens.lg?.replace(/px/g, '')) {
        setTheme('lg')
      }
    }
    window.addEventListener('resize', onChange)
    onChange()

    return () => {
      window.removeEventListener('resize', onChange)
    }
  }, [])

  return theme
}
