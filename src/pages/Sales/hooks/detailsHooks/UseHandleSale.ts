import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormData,
    formatValidationSchema
} from '../../validation/Schema'

import {
    SaleService,
    TSaleStatus
} from '../../../../shared/services/api/sales/SaleService'

interface IUseCalculateShippingProps {
    idSale: string
    idCustomer: string
    formRef: React.RefObject<FormHandles>
    setSaleStatus: (status: TSaleStatus) => void
    setIsLoading: (status: boolean) => void
}

export const UseHandleSale = ({ idSale, idCustomer, formRef, setSaleStatus, setIsLoading }: IUseCalculateShippingProps) => {
    const navigate = useNavigate()

    const handleUpdateTrackingCode = async (data: IFormData) => {

        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })
            setIsLoading(true)
            const result = await SaleService.updateTrackingCode(Number(idSale), Number(idCustomer), validateData.tracking_code)
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
            } else {
                toast.success('Registro atualizado com sucesso!')
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

    const handleConcludeSale = async () => {

        if (confirm('Confirma que o pedido foi entregue?')) {
            setIsLoading(true)
            const result = await SaleService.concludeSale(Number(idCustomer), Number(idSale))

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            setSaleStatus('Concluída')

            //Adicionando as informações atualizadas
            formRef.current?.setFieldValue('status', 'Concluída')
            formRef.current?.setFieldValue('delivery_date', getCurrentDate)
        }
    }

    const handleDeleteSale = async () => {

        if (confirm('Realmente deseja deletar este pedido?')) {
            setIsLoading(true)

            const result = await SaleService.deleteById(Number(idCustomer), Number(idSale))

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/sale')
        }

    }

    return { handleUpdateTrackingCode, handleConcludeSale, handleDeleteSale }

}

const getCurrentDate = (): string => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}/${month}/${year}`
}



