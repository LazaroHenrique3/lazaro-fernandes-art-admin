import { api } from '../axiosConfig'

export interface IPriceDeadlineResponse {
    ceporigem: string,
    cepdestino: string,
    valorpac: string,
    prazopac: string,
    valorsedex: string,
    prazosedex: string
}

export interface ICalculateShipping {
   cep: string
   weight: number,
   width: number,
   length: number,
   height: number
}

export interface ITrackOrderResponse {
    data: string,
    descricao: string,
    unidade: string,
    cidade: string,
    uf: string
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

const calculateShipping = async (consultData: ICalculateShipping): Promise<IPriceDeadlineResponse | Error> => {
    try {
        const { data } = await api.post('/shipping/calculateshipping', consultData)

        if (data) {
            return data
        }

        return new Error('Erro ao calcular frete.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao calcular frete.')
    }
}

const trackOrder = async (trackingCode: string): Promise<ITrackOrderResponse[] | Error> => {
    try {
        const { data } = await api.post(`/shipping/trackOrder/${trackingCode}`)

        if (data) {
            return data
        }

        return new Error('Erro ao rastrear pedido.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao rastrear pedido.')
    }
}

export const ShippingService = {
    calculateShipping,
    trackOrder
}
