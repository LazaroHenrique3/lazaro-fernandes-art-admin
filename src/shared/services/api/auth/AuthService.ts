import { api } from '../axiosConfig'

interface IAuth {
    name: string
    idUser: string
    accessToken: string
    typeUser: string
    accessLevel: string
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

const auth = async (email: string, password: string): Promise<IAuth | Error> => {

    try {
        const { data } = await api.post('/adminsignin', {email, password})

        if (data) {
            return data
        }

        return new Error('Erro ao realizar login.')

    } catch (error) {
        console.error(error)
        return new Error((error as ErrorResponse).response?.data?.errors?.default || 'Erro ao realizar login.')
    }

}

export const AuthService = {
    auth
}