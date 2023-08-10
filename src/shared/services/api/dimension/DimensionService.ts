import { AxiosResponse } from 'axios'
import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

export interface IListDimension {
    id: number
    dimension: string
}

export interface IDetailDimension {
    id: number
    dimension: string
}

type IDimensionTotalCount = {
    data: IListDimension[],
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

const getAll = async (page = 1, filter = '', id?: number[]): Promise<IDimensionTotalCount | Error> => {
    let relativeUrl = ''

    if (id !== undefined && id.length !== 0) {
        const idParams = `${id.join(',')}`

        relativeUrl = `/dimension?id=${idParams}&page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
    } else {
        relativeUrl = `/dimension?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
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

const getById = async (id: number): Promise<IDetailDimension | Error> => {

    try {
        const { data } = await api.get(`/dimension/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: Omit<IDetailDimension, 'id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post('/dimension', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (id: number, updateData: IDetailDimension): Promise<void | Error> => {

    try {
        await api.put(`/dimension/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/dimension/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const generatePdf = async (filter = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/dimension/report/generate?filter=${filter}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })
        
        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const DimensionService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    generatePdf
}