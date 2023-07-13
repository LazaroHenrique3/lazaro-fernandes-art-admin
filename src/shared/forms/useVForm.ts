import { FormHandles } from '@unform/core'
import { useRef } from 'react'

export const useVForm = () => {
    const formRef = useRef<FormHandles>(null)

    return { formRef }
}