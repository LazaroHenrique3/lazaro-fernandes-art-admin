import { AxiosResponse } from 'axios'
import { Environment } from '../../../environment'
import { api } from '../axiosConfig'

export interface IImageProductList {
    id: number
    url: string
}

export type TProductStatus = 'Ativo' | 'Vendido' | 'Inativo' 
export type TProductOrientation = 'Retrato' | 'Paisagem'

export interface IListProduct {
    id: number
    status: TProductStatus
    title: string
    orientation: TProductOrientation
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: string
    product_images: IImageProductList[]
    dimension_id: number
    technique_id: number
    category_id: number
    technique_name: string
    category_name: string
    dimension_name: string
}

export interface IDetailProduct {
    id: number
    status: TProductStatus
    title: string
    orientation: TProductOrientation
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    main_image: string
    product_images: IImageProductList[]
    dimension_id: number
    technique_id: number
    category_id: number
    technique_name: string
    category_name: string
    dimension_name: string
}

export interface IDetailProductUpdate {
    id: number
    status: TProductStatus
    title: string
    orientation: TProductOrientation
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    dimension_id: number
    technique_id: number
    category_id: number
    technique_name: string
    category_name: string
    dimension_name: string
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
        relativeUrl = `/admin/product?id=${id}&page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
    } else {
        relativeUrl = `/admin/product?page=${page}&limit=${Environment.LINE_LIMIT}&filter=${filter}`
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

const create = async (createData: FormData): Promise<number | Error> => {

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

const insertNewImage = async(idProduct: number, newImage: FormData): Promise<AxiosResponse<string> | Error> => {

    try{
        const result: AxiosResponse<string> = await api.post(`/product/insertimage/${idProduct}`, newImage)
        return result
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }

}

const updateById = async (idImage: number, updateData: IDetailProductUpdate): Promise<void | Error> => {

    try {
        await api.put(`/product/${idImage}`, updateData)
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }
}

const updateProductMainImage = async(idImage: number, newImage: FormData): Promise<AxiosResponse<string> | Error> => {

    try{
        const result: AxiosResponse<string> = await api.put(`/product/updatemainimage/${idImage}`, newImage)
        return result
    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao atualizar registro.')

    }

}

const updateProductImage = async(id: number, idProduct: number, newImage: FormData): Promise<AxiosResponse<string> | Error> => {

    try{
        const result: AxiosResponse<string> = await api.put(`/product/updateimage/${id}/${idProduct}`, newImage)
        return result
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

const deleteProductImage = async(id: number, idProduct: number): Promise<void | Error> => {

    try{
        await api.delete(`/product/deleteimage/${id}/${idProduct}`)
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
    insertNewImage,
    updateById,
    updateProductImage,
    updateProductMainImage,
    deleteById,
    deleteProductImage,
    generatePdf
}