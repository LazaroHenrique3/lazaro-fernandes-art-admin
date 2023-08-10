import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormData,
    formatValidationSchema
} from '../../validation/Schemas'

import { CategoryService } from '../../../../shared/services/api/category/CategoryService'

interface IUseHandleCategoryProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseHandleCategory = ({setIsLoading, setName, formRef, id}: IUseHandleCategoryProps ) => {
    const navigate = useNavigate()

    const handleSave = async (data: IFormData) => {
        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })
    
            setIsLoading(true)
    
            if (id === 'new') {
                const result = await CategoryService.create(validateData)
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/category/details/${result}`)
                }
            } else {
                const result = await CategoryService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }
    
                toast.success('Registro salvo com sucesso!')
                setName(data.name)
            }
        } catch (errors) {
    
            const errorsYup: yup.ValidationError = errors as yup.ValidationError
    
            const validationErrors: IVFormErrors = {}
            
            errorsYup.inner.forEach(error => {
                if (!error.path) return
    
                validationErrors[error.path] = error.message
                formRef.current?.setErrors(validationErrors)
            })
        }
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CategoryService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/category')
        }
    }

    return { handleSave, handleDelete }
}

