import axios from 'axios'

interface IInfoCep {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
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

export const getInfoByCep = async (cep: string): Promise<IInfoCep | Error> => {
    try {
        const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

        if(data) {
            return data
        }

        return new Error('Erro ao consultar informações.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao consultar informações.')
    }
}