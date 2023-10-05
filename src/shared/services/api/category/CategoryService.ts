import { AxiosResponse } from 'axios'
import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

export type TCategoryStatus = 'Ativo' | 'Inativo';

export interface IListCategory {
    id: number
    status: TCategoryStatus
    name: string
}

export interface IDetailCategory {
    id: number
    status: TCategoryStatus
    name: string
}

type ICategoryTotalCount = {
    data: IListCategory[],
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

const getAll = async (page = 1, filter = '', showInative = false, id?: number): Promise<ICategoryTotalCount | Error> => {
    let relativeUrl = ''

    if (id) {
        relativeUrl = `/category?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&showInative=${showInative}&filter=${filter}`
    } else {
        relativeUrl = `/category?page=${page}&limit=${Environment.LINE_LIMIT}&showInative=${showInative}&filter=${filter}`
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

const getById = async (id: number): Promise<IDetailCategory | Error> => {

    try {
        const { data } = await api.get(`/category/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: Omit<IDetailCategory, 'id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post('/category', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (id: number, updateData: IDetailCategory): Promise<void | Error> => {

    try {
        await api.put(`/category/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/category/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const generatePdf = async (filter = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/category/report/generate?filter=${filter}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })

        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const CategoryService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    generatePdf
}