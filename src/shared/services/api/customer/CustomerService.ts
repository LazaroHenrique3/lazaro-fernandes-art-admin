import { AxiosResponse } from 'axios'
import { Environment } from '../../../environment'
import { api } from '../axiosConfig'


export interface IListCustomer {
    id: number
    status: 'Ativo' | 'Inativo'
    image: string
    name: string
    email: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}

export interface IDetailCustomer {
    id: number
    status: 'Ativo' | 'Inativo'
    image: string
    name: string
    email: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}

export interface IDetailCustomerUpdate {
    id: number
    status: 'Ativo' | 'Inativo'
    name: string
    email: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}

type ICustomerTotalCount = {
    data: IListCustomer[],
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

const getAll = async (page = 1, filter = '', id?: number): Promise<ICustomerTotalCount | Error> => {
    let relativeUrl = ''

    if (id) {
        relativeUrl = `/customer?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
    } else {
        relativeUrl = `/customer?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
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

const getById = async (id: number): Promise<IDetailCustomer | Error> => {

    try {
        const { data } = await api.get(`/customer/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: FormData): Promise<number | Error> => {

    try {
        const { data } = await api.post('/customer', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const insertNewImage = async(idCustomer: number, newImage: FormData): Promise<AxiosResponse<string> | Error> => {

    try{
        const result: AxiosResponse<string> = await api.post(`/customer/insertimage/${idCustomer}`, newImage)
        return result
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }

}

const updateById = async (idImage: number, updateData: IDetailCustomerUpdate): Promise<void | Error> => {

    try {
        await api.put(`/customer/${idImage}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const updateCustomerImage = async(idImage: number, newImage: FormData): Promise<AxiosResponse<string> | Error> => {

    try{
        const result: AxiosResponse<string> = await api.put(`/customer/updateimage/${idImage}`, newImage)
        return result
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }

}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/customer/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const deleteCustomerImage = async(idCustomer: number): Promise<void | Error> => {

    try{
        await api.delete(`/customer/deleteimage/${idCustomer}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')

    }

}

const generatePdf = async (filter = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/customer/report/generate?filter=${filter}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })

        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const CustomerService = {
    getAll,
    getById,
    create,
    insertNewImage,
    updateById,
    updateCustomerImage,
    deleteById,
    deleteCustomerImage,
    generatePdf
}