import * as yup from 'yup'

export interface IFormData {
  tracking_code: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    tracking_code: yup.string().length(13).matches(/^[A-Z]{2}\d{9}[A-Z]{2}$/).required()
})
