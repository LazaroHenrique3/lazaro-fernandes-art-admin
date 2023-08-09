import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CustomerService } from '../../../../../shared/services/api/customer/CustomerService'

import {
    IFormData,
    IFormDataUpdate,
    formatValidationSchema,
    formatValidationSchemaUpdate
} from '../../validation/Schemas'

interface IUseHandleCustomerProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    setIsAlterPassword: (status: boolean) => void
    isAlterPassword: boolean
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseHandleCustomer = ({ setIsLoading, setName, setIsAlterPassword, isAlterPassword, formRef, id }: IUseHandleCustomerProps) => {
    const navigate = useNavigate()

    const handleSave = async (data: IFormDataUpdate) => {
        try {

            const cell_phone = data.cell_phone.replace(/[^\w]/g, '')
            const cpf = data.cpf.replace(/[^\w]/g, '')

            let validateData: IFormData | IFormDataUpdate

            //Verificando se é update ou novo
            if (id === 'new' || !isAlterPassword) {
                validateData = await formatValidationSchema.validate({ ...data, cell_phone, cpf }, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate({ ...data, cell_phone, cpf }, { abortEarly: false })
            }

            setIsLoading(true)

            const result = await CustomerService.updateById(Number(id), { id: Number(id), ...validateData })
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro salvo com sucesso!')
            setIsAlterPassword(false)
            setName(data.name)

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
            const result = await CustomerService.deleteById(id)
    
            if (result instanceof Error) {
                toast.error(result.message)
                return
            }
    
            toast.success('Registro apagado com sucesso!')
            navigate('/admin/customer')
        }
    }

    return { handleSave, handleDelete }
}


