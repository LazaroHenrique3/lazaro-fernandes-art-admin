import * as yup from 'yup'

export interface IFormDataForgotPassword {
    email: string
}

//Definindo o schema para validação
export const formatValidationSchemaForgotPassword: yup.Schema<IFormDataForgotPassword> = yup.object().shape({
    email: yup.string().email().min(5).max(100).matches(/^[\w!#$%&'*+/=?`{|}~.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ex: exemplo@dominio.com').required(),
})