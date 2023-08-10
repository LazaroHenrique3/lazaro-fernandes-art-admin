import * as yup from 'yup'

export interface IFormData {
    name: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
})