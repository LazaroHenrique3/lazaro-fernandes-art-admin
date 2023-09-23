import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {  
    ISaleItemsList,
    ISaleListById,
    SaleService,
    TSalePaymentMethods,
    TSaleStatus 
} from '../../../../shared/services/api/sales/SaleService'

import { 
    CustomerService, 
    IListCustomer 
} from '../../../../shared/services/api/customer/CustomerService'

import { 
    IListAddress 
} from '../../../../shared/services/api/address/AddressService'

import { 
    formattedDateBR, 
    formattedPrice 
} from '../../../../shared/util'

interface IUseFetchSaleDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    setPaymentMethod: (paymentMethod: TSalePaymentMethods) => void
    setSaleStatus: (status: TSaleStatus) => void
    setSaleItems: (saleItems: ISaleItemsList[]) => void
    setSaleAddress: (saleAddress: IListAddress) => void
    setSaleCustomer: (saleAddress: IListCustomer) => void
    formRef: React.RefObject<FormHandles>
    idSale: string
    idCustomer: string
}

export const UseFetchSaleData = ({ 
    setIsLoading, 
    setName, 
    setSaleItems, 
    setPaymentMethod,
    setSaleStatus, 
    setSaleAddress, 
    setSaleCustomer,
    formRef, 
    idSale,
    idCustomer }: IUseFetchSaleDataProps) => {

    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {

            setIsLoading(true)
            const result = await SaleService.getById(Number(idCustomer), Number(idSale))
            
            //Buscando o cliente da venda
            const saleCustomer = await CustomerService.getById(Number(idCustomer))

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                navigate('/admin/sale')
                return
            }

            if (saleCustomer instanceof Error) {
                toast.error(saleCustomer.message)
                navigate('/admin/sale')
                return
            }

            //Desentruturando as informações do pedido
            const { sale_items, sale_address, ...sale } = result

            //Formatando as informaçõs do pedido
            const formattedOrder = formatOrderInfo(sale)

            //Setando as informações dos produtos do pedido
            setSaleItems(sale_items)

            //Setando as informações do endereço de entrega
            setSaleAddress(sale_address)

            setPaymentMethod(sale.payment_method)
            setSaleStatus(sale.status)

            //Setando a sinformações do cliente da venda
            setSaleCustomer(saleCustomer)

            setName(`${formattedOrder.customer_name} - #${formattedOrder.id}`)
            formRef.current?.setData(formattedOrder)
        }

        fetchData()

    }, [idSale])

}

const formatOrderInfo = (sale: Omit<ISaleListById, 'sale_items' | 'sale_address'>) => {

    //Tratando caso essas informações ainda não tenham sido informadas
    const deliveryDate = sale.delivery_date ? formattedDateBR(sale.delivery_date) : ' '
    const paymentReceivedDate = sale.payment_received_date ? formattedDateBR(sale.payment_received_date) : ' '
    const trackingCode = sale.tracking_code ? sale.tracking_code : ' '

    //Formatando as Strings
    const shippingCost = formattedPrice(sale.shipping_cost)
    const subtotal = formattedPrice(sale.total)
    const totalOrderCost = formattedPrice(sale.total + sale.shipping_cost)
    const orderDate = formattedDateBR(sale.order_date)
    const estimatedDeliveryDate = formattedDateBR(sale.estimated_delivery_date)
    const paymentDueDate = formattedDateBR(sale.payment_due_date)

    const formattedOrder = {
        ...sale,
        shipping_cost: shippingCost,
        subtotal: subtotal,
        total: totalOrderCost,
        order_date: orderDate,
        estimated_delivery_date: estimatedDeliveryDate,
        delivery_date: deliveryDate,
        payment_received_date: paymentReceivedDate,
        payment_due_date: paymentDueDate,
        tracking_code: trackingCode
    }

    return formattedOrder
}



