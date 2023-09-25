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

    const handleDeleteSale = async (idCustomer: number, idSale: number) => {
        if (!idUser) return

        if (confirm('Realmente deseja deletar este pedido?')) {
            setIsLoading(true)

            const result = await SaleService.deleteById(idCustomer, idSale)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/sale')
        }

    }

    return { handleConcludeSale, handleDeleteSale }

}

const getCurrentDate = (): string => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()

    return `${day}/${month}/${year}`
}



