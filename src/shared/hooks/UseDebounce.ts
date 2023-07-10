import { useCallback, useRef } from 'react'

export const useDebounce = (delay = 500, notDelayInFirstTime = true) => {
    //Guarda o timeout
    const debouncing = useRef<NodeJS.Timeout>()

    //Pois pode ser que logo de cara eu não queira que seja feito o delay
    const isFirstTime = useRef(notDelayInFirstTime)

    const debounce = useCallback((func: () => void) => {
        if (isFirstTime.current) {

            isFirstTime.current = false
            func()
        } else {
            //Se tiver um timeout em execução eu cancelo ele e adiciono outro que vai aumentar mais segundos
            if (debouncing.current) {
                clearTimeout(debouncing.current)
            }

            debouncing.current = setTimeout(() => {
                func()
            }, delay)
        }
    }, [delay])

    return { debounce }
}