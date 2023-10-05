import * as yup from 'yup'

import { 
    TCategoryStatus 
} from '../../../shared/services/api/category/CategoryService'

export interface IFormData {
    status: TCategoryStatus
    name: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
})