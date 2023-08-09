import * as yup from 'yup'

export interface IFormDataForgotPassword {
    email: string
}

//Definindo o schema para validação
export const formatValidationSchemaForgotPassword: yup.Schema<IFormDataForgotPassword> = yup.object().shape({
    email: yup.string().required().email().min(5).max(100),
})