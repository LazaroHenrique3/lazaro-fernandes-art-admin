import { Environment } from '../../../enviroment'
import { api } from '../axiosConfig'

export interface IListTechnique {
    id: number
    name: string
}

export interface IDetailTechnique {
    id: number
    name: string
}

type ITechniqueTotalCount = {
    data: IListTechnique[],
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

const getAll = async (page = 1, filter = ''): Promise<ITechniqueTotalCount | Error> => {

    try {
        const relativeUrl = `/technique?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`

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

const getById = async (id: number): Promise<IDetailTechnique | Error> => {

    try {
        const { data } = await api.get(`/technique/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: Omit<IDetailTechnique, 'id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post('/technique', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (id: number, updateData: IDetailTechnique): Promise<void | Error> => {

    try {
        await api.put(`/technique/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/technique/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

export const TechniqueService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}