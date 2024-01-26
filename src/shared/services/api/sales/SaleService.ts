import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

import { IListAddress } from '.././address/AddressService'
import { AxiosResponse } from 'axios'

export type TSalePaymentMethods = 'PIX' | 'BOLETO' | 'C. CREDITO' | 'C.DEBITO'
export type TSaleShippingMethods = 'PAC' | 'SEDEX'
export type TSaleStatus = 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'

export interface ISaleItems {
    idProduct: number
    quantity: number
    discount?: number
}

export interface IDetailSale {
    id: number
    status: TSaleStatus
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: TSalePaymentMethods
    shipping_method: TSaleShippingMethods
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost: number
    tracking_code?: string
    customer_id: number
    address_id: number
    sale_items: ISaleItems[]
}

export interface ISaleItemsList {
    product_id: number
    sale_id: number
    quantity: number
    price: number
    discount: number
    product_title: string
}

export interface ISaleListById {
    id: number
    status: TSaleStatus
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: TSalePaymentMethods
    shipping_method: TSaleShippingMethods
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost: number
    tracking_code?: string
    customer_id: number
    address_id: number
    sale_items: ISaleItemsList[]
    sale_address: IListAddress
    customer_name: string,
    total: number
}

export interface ISaleListAll {
    id: number
    status: 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: 'PIX' | 'BOLETO' | 'C. CREDITO' | 'C. DEBITO'
    shipping_method: 'PAC' | 'SEDEX'
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost: number
    tracking_code?: string
    customer_id: number
    address_id: number
    customer_name: string
    total: number
}

type ISaleTotalCount = {
    data: ISaleListAll[],
    totalCount: number
}

export type TTopCategories = {
    name: string
    total_sales: number
}

export interface IFinancialInformations {
    topCategories: TTopCategories[]
    totalRevenue: number
    currentMonthBilling: number
    lastMonthBilling: number
    totalSaleAwaitingPayment: number
    totalSaleInPreparation: number
}

interface ErrorResponse {
    response: {
        data?: {
            errors?: {
                default?: string
            }
        }
    }
}

const getFinancialInformation = async  (): Promise<IFinancialInformations | Error> => {

    try {

        const { data } = await api.get('/sales/financial-information')

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

        
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao buscar informações.')
    }

}

const getAllAdmin = async (page = 1, filter = '', status = '', orderDate = '', paymentDueDate = '', orderByPrice = ''): Promise<ISaleTotalCount | Error> => {
    const relativeUrl = `/admin/sale?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}&status=${status}&orderDate=${orderDate}&paymentDueDate=${paymentDueDate}&orderByPrice=${orderByPrice}`

    try {
        const { data, headers } = await api.get(relativeUrl)

        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environment.LINE_LIMIT)
            }
        }

        return new Error('Erro ao listar registros.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao listar registros.')
    }
}

const getById = async (idCustomer: number, idSale: number): Promise<ISaleListById | Error> => {

    try {
        const { data } = await api.get(`/sale/${idCustomer}/${idSale}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const sendSale = async (idCustomer: number, idSale: number, trackingCode: string): Promise<void | Error> => {

    try {
        await api.put(`/sale/send/${idCustomer}/${idSale}`, {tracking_code: trackingCode})
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao enviar venda.')
    }

}


const cancelSale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        await api.put(`/sale/cancel/${idCustomer}/${idSale}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao cancelar venda.')

    }

}

const concludeSale = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        await api.put(`/sale/concluded/${idCustomer}/${idSale}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao concluir venda.')
    }

}

const updateTrackingCode = async (idCustomer: number, idSale: number, trackingCode: string): Promise<void | Error> => {

    try {
        await api.put(`/sale/update/tracking-code/${idCustomer}/${idSale}`, {tracking_code: trackingCode})
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')
    }

}

const deleteById = async (idCustomer: number, idSale: number): Promise<void | Error> => {

    try {
        await api.delete(`/sale/${idCustomer}/${idSale}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao excluir venda.')
    }

}

const generatePdf = async (filter = '', status = '', orderDate = '', paymentDueDate = '', orderByPrice = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/sales/report/generate?filter=${filter}&status=${status}&orderDate=${orderDate}&paymentDueDate=${paymentDueDate}&orderByPrice=${orderByPrice}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })

        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const SaleService = {
    getFinancialInformation,
    getAllAdmin,
    getById,
    sendSale,
    cancelSale,
    concludeSale,
    updateTrackingCode,
    deleteById,
    generatePdf
}


