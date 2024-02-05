import * as yup from 'yup'
import { FormHandles } from '@unform/core'

import { IVFormErrors } from '../../../../forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    IFormData,
    formatValidationSchema,
} from '../validation/Schema'

import { 
    SaleService, 
    TSaleStatus 
} from '../../../../services/api/sales/SaleService'

interface IUseSendOrder {
    setIsLoading: (status: boolean) => void
    setOpen: (opens: boolean) => void
    idCustomer: number,
    idSale: number
    updateSendStatus: (status: TSaleStatus) => void
    setTrackingCode: (trakingCode: string) => void
    externalFormSaleRef: React.RefObject<FormHandles>
    formRef: React.RefObject<FormHandles>
}

export const UseSendSale = ({ setIsLoading, setOpen, idCustomer, idSale, updateSendStatus, setTrackingCode, externalFormSaleRef, formRef }: IUseSendOrder) => {

    const handleSendSale = async (data: IFormData) => {
        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })

            setIsLoading(true)

            const result = await SaleService.sendSale(idCustomer, idSale, validateData.tracking_code)
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            //Adicionando as informações atualizadas no form principal
            externalFormSaleRef.current?.setFieldValue('status', 'Enviado')
            externalFormSaleRef.current?.setFieldValue('tracking_code', validateData.tracking_code)
            setTrackingCode(validateData.tracking_code)

            toast.success('Status da venda foi atualizado para "Enviado"!')
            updateSendStatus('Enviado')
            setOpen(false)

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

    return { handleSendSale }

}