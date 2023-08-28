import * as yup from 'yup'

export interface IFormData {
    status: string
    city: string
    state: string
    number: number
    cep: string
    complement?: string
    neighborhood: string
    street: string
}

export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    city: yup.string().max(45).required(),
    state: yup.string().max(45).required(),
    number: yup.number().integer().required().moreThan(0),
    cep: yup.string().length(8).required(),
    complement: yup.string().optional(),
    neighborhood: yup.string().required(),
    street: yup.string().required()
}) 