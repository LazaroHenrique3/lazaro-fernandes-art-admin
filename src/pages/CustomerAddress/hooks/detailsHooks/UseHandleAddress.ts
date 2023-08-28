import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormData,
    formatValidationSchema
} from '../.././validation/Schemas'

import { getInfoByCep } from '../../../../shared/services/external/viaCep/GetInfoByCep' 
import { AddressService } from '../../../../shared/services/api/address/AddressService' 

interface IUseHandleAddressProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
    idCustomer: string
    nameCustomer: string
}

export const UseHandleAddress = ({ setIsLoading, setName, formRef, id, idCustomer, nameCustomer }: IUseHandleAddressProps) => {

    const navigate = useNavigate()

    const handleGetInfoByCep = async (cep: string) => {

        try {
            setIsLoading(true)

            const cepFormatted = cep.replace(/[^\w]/g, '')
            const result = await getInfoByCep(cepFormatted)

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            formRef.current?.setData({
                cep: result.cep,
                city: result.localidade,
                state: result.uf,
                complement: result.complemento,
                neighborhood: result.bairro,
                street: result.logradouro
            })

        } catch (error) {
            console.error(error)
            toast.error('Houve um erro ao consultar cep!')
        }

    }

    const handleSave = async (data: IFormData) => {

        try {
            const cep = data.cep.replace(/[^\w]/g, '')
            const validateData = await formatValidationSchema.validate({ ...data, cep: cep }, { abortEarly: false })

            setIsLoading(true)

            if (id === 'new') {
                const result = await AddressService.create(Number(idCustomer), validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/customer/customer-address/details/${idCustomer}/${result}/${nameCustomer}`)
                }
            } else {
                const result = await AddressService.updateById(Number(idCustomer), Number(id), validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                toast.success('Registro salvo com sucesso!')
                setName(data.street)
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

    const handleDelete = async (id: number) => {

        if (confirm('Realmente deseja apagar esse endereço?')) {
            const result = await AddressService.deleteById(Number(idCustomer), id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate(`/admin/customer/customer-address/list/${idCustomer}/${nameCustomer}`)
        }
    }

    return { handleGetInfoByCep, handleSave, handleDelete }
}

