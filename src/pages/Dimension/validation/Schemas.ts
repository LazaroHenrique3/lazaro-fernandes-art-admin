import * as yup from 'yup'

export interface IFormData {
    width: number
    height: number
    thickness: number
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    width: yup.number().required().moreThan(0).max(500),
    height: yup.number().required().moreThan(0).max(500),
    thickness: yup.number().required().moreThan(0).max(10)
})
