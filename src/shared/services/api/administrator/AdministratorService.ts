import { AxiosResponse } from 'axios'
import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

export interface IListAdministrator {
    id: number
    status: string
    name: string
    email: string
}

export interface IDetailAdministrator {
    id: number
    status: string
    name: string
    email: string
}

export interface IRedefineAdministrator {
    email: string
    verification_token: string
    password: string
    confirmPassword: string
}

type IAdministratorTotalCount = {
    data: IListAdministrator[],
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

const getAll = async (page = 1, filter = '', status = '', id?: number): Promise<IAdministratorTotalCount | Error> => {
    let relativeUrl = ''

    if (id) {
        relativeUrl = `/administrator?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}&status=${status}`
    } else {
        relativeUrl = `/administrator?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}&status=${status}`
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

const getById = async (id: number): Promise<IDetailAdministrator | Error> => {

    try {
        const { data } = await api.get(`/administrator/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: Omit<IDetailAdministrator, 'id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post('/administrator', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (id: number, updateData: IDetailAdministrator): Promise<void | Error> => {

    try {
        await api.put(`/administrator/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/administrator/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const forgotPassword = async (email: string): Promise<AxiosResponse<string> | Error> => {

    try {
        const result: AxiosResponse<string> = await api.post('/administrator/forgotpassword', {email})
        return result
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Houve um erro inesperado.')
    }

}

const redefinePassword = async (redefineData: IRedefineAdministrator): Promise<void | Error> => {

    try {
        await api.post('/administrator/redefinepassword', redefineData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const generatePdf = async (filter = '', status = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/administrator/report/generate?filter=${filter}&status=${status}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })

        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const AdministratorService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    forgotPassword,
    redefinePassword,
    generatePdf
}