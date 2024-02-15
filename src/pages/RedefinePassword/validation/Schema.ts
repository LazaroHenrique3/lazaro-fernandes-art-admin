import * as yup from 'yup'

export interface IFormData {
    email: string
    verification_token: string
    password: string
    confirmPassword: string
}

//Definindo o schema para validação de atualização
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    email: yup.string().email().min(5).max(100).matches(/^[\w!#$%&'*+/=?`{|}~.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ex: exemplo@dominio.com').required(),
    verification_token: yup.string().transform(value => (value ? value.trim() : '')).length(6).required(),
    password: yup.string().required().min(6).max(256),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required()
}) 
