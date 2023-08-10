import * as yup from 'yup'

export interface IFormData {
    dimension: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    dimension: yup.string().required().min(3).max(20)
        .matches(/^\d+ x \d+$/, 'Formato inválido. Use o formato: "20 x 30"')
})
