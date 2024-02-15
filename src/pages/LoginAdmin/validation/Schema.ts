import * as yup from 'yup'

export interface IFormData {
    email: string
    password: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    email: yup.string().email().min(5).max(100).matches(/^[\w!#$%&'*+/=?`{|}~.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ex: exemplo@dominio.com').required(),
    password: yup.string().required().min(6).max(256),
})
