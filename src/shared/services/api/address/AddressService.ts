import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

export interface IListAddress {
    id: number
    status: string
    city: string
    state: string
    number: number
    cep: string
    complement?: string
    neighborhood: string
    street: string
    customer_id: number
}

export interface IDetailAddress {
    id: number
    status: string
    city: string
    state: string
    number: number
    cep: string
    complement?: string
    neighborhood: string
    street: string
    customer_id: number
}

type IAddressTotalCount = {
    data: IListAddress[],
    totalCount: number
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

const getAll = async (page = 1, filter = '', idCustomer: number, showInative = false, id?: number): Promise<IAddressTotalCount | Error> => {
    let relativeUrl = ''

    if (id) {
        relativeUrl = `/address/${idCustomer}?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&showInative=${showInative}&filter=${filter}`
    } else {
        relativeUrl = `/address/${idCustomer}?page=${page}&limit=${Environment.LINE_LIMIT}&showInative=${showInative}&filter=${filter}`
    }

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

const getById = async (idCustomer: number, id: number): Promise<IDetailAddress | Error> => {

    try {
        const { data } = await api.get(`/address/${idCustomer}/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (idCustomer: number, createData: Omit<IDetailAddress, 'id' | 'customer_id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post(`/address/${idCustomer}`, createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (idCustomer: number, id: number, updateData: Omit<IDetailAddress, 'id' | 'customer_id'>): Promise<void | Error> => {

    try {
        await api.put(`/address/${idCustomer}/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (idCustomer: number, id: number): Promise<void | Error> => {

    try {
        await api.delete(`/address/${idCustomer}/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

export const AddressService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}