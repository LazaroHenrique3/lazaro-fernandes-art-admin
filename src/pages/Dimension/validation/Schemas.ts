import * as yup from 'yup'

import { 
    TDimensionStatus 
} from '../../../shared/services/api/dimension/DimensionService'

export interface IFormData {
    status: TDimensionStatus
    width: number
    height: number
    thickness: number
}

//Definindo o schema para validação
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
    width: yup.number().required().moreThan(0).max(500),
    height: yup.number().required().moreThan(0).max(500),
    thickness: yup.number().required().moreThan(0).max(10)
})
