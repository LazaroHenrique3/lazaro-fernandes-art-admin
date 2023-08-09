import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../../../../shared/contexts'

import { IVFormErrors } from '../../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormData,
    IFormDataUpdate,
    formatValidationSchema,
    formatValidationSchemaUpdate
} from '../.././validation/Schemas'

import { AdministratorService } from '../../../../../shared/services/api/administrator/AdministratorService'

interface IUseHandleAdministratorProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    setIsAlterPassword: (status: boolean) => void
    isAlterPassword: boolean
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseHandleAdministrator = ({
    setIsLoading,
    setIsAlterPassword,
    setName,
    isAlterPassword,
    formRef,
    id }: IUseHandleAdministratorProps) => {

    const navigate = useNavigate()

    const { idUser, handleName, accessLevel } = useAuthContext()

    const handleSave = async (data: IFormData) => {
        try {

            let validateData: IFormData | IFormDataUpdate

            //Verificando se é update ou novo
            if (id === 'new' || !isAlterPassword) {
                validateData = await formatValidationSchema.validate(data, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate(data, { abortEarly: false })
            }

            setIsLoading(true)

            if (id === 'new') {
                const result = await AdministratorService.create(validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')

                    if (accessLevel !== undefined && accessLevel === 'Root') {
                        navigate(`/admin/administrator/details/${result}`)
                        return
                    }

                    navigate('/admin/administrator')
                }
            } else {
                const result = await AdministratorService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                //Significa que é o usuario logado que está alterando suas próprias informações
                if (Number(id) === Number(idUser)) {
                    handleName(data.name)
                    localStorage.setItem('APP_USER_NAME', JSON.stringify(data.name))
                }

                toast.success('Registro salvo com sucesso!')
                setIsAlterPassword(false)
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
            const result = await AdministratorService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/administrator')
        }
    }

    return { handleSave, handleDelete }
}


