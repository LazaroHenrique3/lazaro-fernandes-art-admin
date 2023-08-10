import * as yup from 'yup'

export interface IFormData {
    status: 'Ativo' | 'Inativo'
    name: string
    email: string
}

export interface IFormDataUpdate {
    status: 'Ativo' | 'Inativo'
    name: string
    email: string
    password: string
    confirmPassword: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    email: yup.string().required().email().min(5).max(100),
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
})    

//Definindo o schema para validação de atualização
export const formatValidationSchemaUpdate: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    email: yup.string().required().email().min(5).max(100),
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
    password: yup.string().required().min(6).max(256),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required()
}) 