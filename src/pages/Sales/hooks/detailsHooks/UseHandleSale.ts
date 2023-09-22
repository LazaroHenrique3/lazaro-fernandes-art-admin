import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAuthContext } from '../../../../shared/contexts'
import {  
    SaleService,
    TSaleStatus 
} from '../../../../shared/services/api/sales/SaleService'

interface IUseCalculateShippingProps {
    formRef: React.RefObject<FormHandles>
    setSaleStatus: (status: TSaleStatus) => void
    setIsLoading: (status: boolean) => void
}

export const UseHandleSale = ({ formRef, setSaleStatus, setIsLoading }: IUseCalculateShippingProps) => {
    const navigate = useNavigate()

    const { idUser } = useAuthContext()

    /* const handlePaySale = async (idSale: number) => {
        if (!idUser) return

        if (confirm('Confirmar pagamento do pedido?')) {
            setIsLoading(true)
            const result = await SaleService.paySale(idUser, idSale)

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                navigate('/customer/orders')
                return
            }

            setSaleStatus('Em preparação')

            //Adicionando as informações atualizadas
            formRef.current?.setFieldValue('status', 'Em preparação')
            formRef.current?.setFieldValue('payment_received_date', getCurrentDate())
        }
    } */

    const handleConcludeSale = async (idSale: number) => {
        if (!idUser) return

        if (confirm('Confirma que seu pedido foi entregue?')) {
            setIsLoading(true)
            const result = await SaleService.concludeSale(idUser, idSale)

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

    return { handleConcludeSale }

}

const getCurrentDate = (): string => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}/${month}/${year}`
}



