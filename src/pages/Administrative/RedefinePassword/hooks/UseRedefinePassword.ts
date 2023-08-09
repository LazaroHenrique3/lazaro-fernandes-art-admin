import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAuthContext } from '../../../../shared/contexts'
import { AdministratorService } from '../../../../shared/services/api/administrator/AdministratorService'

import {
    IFormData,
    formatValidationSchema,
} from '../validation/Schema'

interface IUseRedefinePassword {
    setIsLoading: (status: boolean) => void
    formRef: React.RefObject<FormHandles>
}

export const UseRedefinePassword = ({ setIsLoading, formRef }: IUseRedefinePassword) => {
    const navigate = useNavigate()

    const { login } = useAuthContext()

    const handleRedefinePassword = async (data: IFormData) => {
        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })

            setIsLoading(true)

            const resultRedefine = await AdministratorService.redefinePassword(validateData as IFormData)
            setIsLoading(false)

            if (resultRedefine instanceof Error) {
                toast.error(resultRedefine.message)
                return
            }

            setIsLoading(true)

            //Significa que já foi alterado a senha, logo posso fazer o login
            const resultLogin = await login(validateData.email, validateData.password)
            setIsLoading(false)

            if (typeof resultLogin === 'string') {
                toast.error(resultLogin)
            } else {
                navigate('/admin/admin-home')
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

    return { handleRedefinePassword }

}
