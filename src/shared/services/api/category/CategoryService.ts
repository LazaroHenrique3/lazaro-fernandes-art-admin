import { Environment } from '../../../enviroment'
import { api } from '../axiosConfig'

export interface IListCategory {
    id: number
    name: string
}

export interface IDetailCategory {
    id: number
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

const getAll = async (page = 1, filter = ''): Promise<ICategoryTotalCount | Error> => {

    try {
        const relativeUrl = `/category?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`

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

export const CategoryService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}