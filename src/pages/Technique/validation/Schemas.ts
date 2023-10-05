import * as yup from 'yup'

import { 
    TTechniqueStatus 
} from '../../../shared/services/api/technique/TechniqueService'

export interface IFormData {
    status: TTechniqueStatus
    name: string
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
})