import { AxiosResponse } from 'axios'
import { Environment } from '../../../enviroment'
import { api } from '../axiosConfig'

export interface IListProduct {
    id: number
    status: 'Ativo' | 'Vendido' | 'Inativo'
    status_of_sale: 'Venda' | 'Galeria'
    title: string
    type: 'Original' | 'Print'
    orientation: 'Retrato' | 'Paisagem'
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: any
    products: string[] | number[]
    product_images: any[]
    technique_id: number
    category_id: number
}

export interface IDetailProduct {
    id: number
    status: 'Ativo' | 'Vendido' | 'Inativo'
    status_of_sale: 'Venda' | 'Galeria'
    title: string
    type: 'Original' | 'Print'
    orientation: 'Retrato' | 'Paisagem'
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: any
    products: string[] | number[]
    product_images: any[]
    technique_id: number
    category_id: number
}

type IProductTotalCount = {
    data: IListProduct[],
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

const getAll = async (page = 1, filter = '', id?: number): Promise<IProductTotalCount | Error> => {
    let relativeUrl = ''

    if (id) {
        relativeUrl = `/product?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
    } else {
        relativeUrl = `/product?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
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

const getById = async (id: number): Promise<IDetailProduct | Error> => {

    try {
        const { data } = await api.get(`/product/${id}`)

        if (data) {
            return data
        }

        return new Error('Erro ao consultar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar registro.')
    }

}

const create = async (createData: Omit<IDetailProduct, 'id'>): Promise<number | Error> => {

    try {
        const { data } = await api.post('/product', createData)

        if (data) {
            return data
        }

        return new Error('Erro ao criar registro.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao criar registro.')

    }
}

const updateById = async (id: number, updateData: IDetailProduct): Promise<void | Error> => {

    try {
        await api.put(`/product/${id}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const deleteById = async (id: number): Promise<void | Error> => {

    try {
        await api.delete(`/product/${id}`)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao deletar registro.')
    }

}

const generatePdf = async (filter = ''): Promise<Uint8Array | Error> => {

    try {
        const relativeUrl = `/product/report/generate?filter=${filter}`

        const response: AxiosResponse<Uint8Array> = await api.get(relativeUrl, {
            responseType: 'arraybuffer', // Configura o tipo de resposta como "arraybuffer"
        })

        return new Uint8Array(response.data)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao gerar PDF.')
    }
}

export const ProductService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    generatePdf
}