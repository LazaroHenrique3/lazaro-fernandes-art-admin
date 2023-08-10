import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormDataForgotPassword,
    formatValidationSchemaForgotPassword
} from '.././validation/Schema'

import { AdministratorService } from '../../../shared/services/api/administrator/AdministratorService'

interface IUseForgotPassword {
    setIsLoading: (status: boolean) => void
    formRef: React.RefObject<FormHandles>
}

export const UseForgotPassword = ({ setIsLoading, formRef }: IUseForgotPassword) => {
    const navigate = useNavigate()

    const handleForgotPassword = async (data: IFormDataForgotPassword) => {
        try {
            const validateData = await formatValidationSchemaForgotPassword.validate(data, { abortEarly: false })

            setIsLoading(true)

            const result = await AdministratorService.forgotPassword(validateData.email)
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success(result.data)
            navigate(`/admin/redefine-password/${validateData.email}`)

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

    return { handleForgotPassword }
}

