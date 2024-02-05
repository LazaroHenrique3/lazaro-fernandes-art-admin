import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    SaleService, TSaleShippingMethods,
} from '../../../../services/api/sales/SaleService'

import { IListAddress } from '../../../../services/api/address/AddressService'
import { FormHandles } from '@unform/core'
import { formattedDateBR, formattedPrice } from '../../../../util'

interface IUseHandleSaleAddressProps {
    formRef: React.RefObject<FormHandles>
    idUser: number
    setCardLoading: (status: boolean) => void
    setSaleAddress: (address: IListAddress) => void
    handleClose: () => void
}



export const UseHandleSaleAddress = ({ formRef, idUser, setSaleAddress, handleClose, setCardLoading }: IUseHandleSaleAddressProps) => {
    const navigate = useNavigate()

    const handleUpdateSaleAddress = async (idSale: number, idNewAddress: number, shippingMethod: TSaleShippingMethods) => {

        if (confirm('Confirma a alteração de endereço de entrega?')) {
            const result = await SaleService.updateSaleAddress(idUser, idSale, idNewAddress, shippingMethod)

            if (result instanceof Error) {
                toast.error(result.message)
                navigate(`/customer/orders/details/${idSale}`)
                return
            }

            formRef.current?.setFieldValue('estimated_delivery_date', formattedDateBR(result.estimated_delivery_date))
            formRef.current?.setFieldValue('shipping_method', result.shipping_method)
            formRef.current?.setFieldValue('shipping_cost', formattedPrice(result.shipping_cost))
            formRef.current?.setFieldValue('total', formattedPrice(result.subtotal + result.shipping_cost))

            toast.success('Endereço de entrega atualizado com sucesso!')
            setSaleAddress(result.updatedAddress)
            handleClose()
        }
    }

    const calculateShipping = async (idCustomer: number, idSale: number, cep: string) => {
        
        try {
            const formattedCep = cep.replace(/[^\w]/g, '')
            setCardLoading(true)

            const result = await SaleService.recalculateShipping(idCustomer, idSale, formattedCep)
            setCardLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            return result
        } catch (error) {
            toast.error('Houve um erro ao consultar o frete!')
            console.error(error)
        }
    }

    return { handleUpdateSaleAddress, calculateShipping }

}




