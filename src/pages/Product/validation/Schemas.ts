import * as yup from 'yup'

import {
    TProductOrientation,
    TProductStatus,
    TProductType
} from '../../../shared/services/api/product/ProductService'
//Relacionado as validações
import {
    existsImage,
    isValidType,
    isValidSize,
    isValidMainImageDimensions,
    isValidProductImagesDimensions,
    existsImagesAndIsSmallerThanMax
} from '../../../shared/util/validationUtils/product'


export interface IFormData {
    status: TProductStatus
    type: TProductType
    title: string
    orientation: TProductOrientation
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    main_image: FileList
    product_images: FileList
    dimension_id: number
    technique_id: number
    category_id: number
}

export interface IFormDataUpdate {
    status: TProductStatus
    type: TProductType
    title: string
    orientation: TProductOrientation
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    dimension_id: number
    technique_id: number
    category_id: number
}

//Definindo o schema para validação default com as informações de venda(price, weight, quantity)
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).default('Ativo').required(),
    type: yup.string().oneOf(['Original', 'Print']).required(),
    title: yup.string().required().min(1).max(100),
    orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
    production_date: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('dateTest', value => {
            const limitDate = new Date(2018, 0, 1)

            if (!value) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'production_date')
            }

            //Verificando se a data é anterior a 2018
            const productDate = new Date(value)
            if (!(productDate >= limitDate)) {
                throw new yup.ValidationError('Não são aceitos produtos antes de 2018!', value, 'production_date')
            }

            //Verificando se a data é maior que hoje
            const currentDate = new Date()
            if (!(productDate <= currentDate)) {
                throw new yup.ValidationError('A data não pode ser maior que a data atual!', value, 'production_date')
            }

            return true
        })
        .required(),
    description: yup.string().optional(),
    main_image: yup.mixed()
        .test('isImage', async (value) => {
            const mainImage: FileList = value as FileList

            // Obtendo a primeira imagem do FileList
            const image = mainImage[0]

            //Verificando se foi passado imagem
            existsImage(mainImage.length, value)

            //Verificando o formato das imagens
            isValidType(image.type, value)

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            isValidSize(image.size, value)

            //Verificando as dimensões recomendadaas
            await isValidMainImageDimensions(image, value)

            return true
        })
        .required() as yup.Schema<FileList>,
    product_images: yup.mixed()
        .test('isImage', async (value) => {
            const product_images: FileList = value as FileList

            //Verificando se foi passado imagem e se é mais que  o permitido
            existsImagesAndIsSmallerThanMax(product_images.length, value)

            //Verificando o formato das imagens
            isValidType(product_images, value)

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            isValidSize(product_images, value)

            //Validando as dimensões das imagens
            await isValidProductImagesDimensions(product_images, value)

            // Todas as imagens passaram nas validações
            return true
        })
        .required() as yup.Schema<FileList>,
    dimension_id: yup.number().moreThan(0).required(),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
    quantity: yup.number().test('quantity-conditional-validation', 'A quantidade deve ser maior que zero!', function (value) {

        if (typeof value === 'number' && value > 1000) {
            return this.createError({
                path: this.path,
                message: 'Quantiddade max: 1000!',
            })
        } else if (typeof value === 'number' && value < 0) {
            return this.createError({
                path: this.path,
                message: 'A quantidade não pode ser negativa!',
            })
        }

        const status = this.resolve(yup.ref('status'))
        const type = this.resolve(yup.ref('type'))

        if (status === 'Ativo') {
            if (typeof value === 'number' && value > 0) {

                //Se for do tipo Original só pode ter uma unidade
                if (type === 'Original' && value > 1) {
                    return this.createError({
                        path: this.path,
                        message: 'Originais podem ter apenas 1 und!',
                    })
                }

                return true
            } else {
                return this.createError({
                    path: this.path,
                    message: 'A quantidade deve ser maior que zero!',
                })
            }
        } else if (status === 'Vendido') {
            if (typeof value === 'number' && value > 0) {
                return this.createError({
                    path: this.path,
                    message: 'Produtos vendidos precisam ter 0 und!',
                })
            }
        } else if (status === 'Inativo') {
            if (typeof value === 'number' && value > 0) {
                //Se for do tipo Original só pode ter uma unidade
                if (type === 'Original' && value > 1) {
                    return this.createError({
                        path: this.path,
                        message: 'Originais podem ter apenas 1 und!',
                    })
                }

                return true
            }
        }

        return true
    }).required(),
    price: yup.number().moreThan(0).max(1000000, 'Valor max: 1.000.000').required(),
    weight: yup.number().moreThan(0).min(5, 'Peso min: 5(g) = 0,005(kg)').max(5000, 'Peso max: 5000(g) = 5(kg)').required(),
})

//Definindo o schema para validação default com as informações de venda(price, weight, quantity), além disso na alteração eu não envio as imagens
export const formatValidationSchemaUpdate: yup.Schema<IFormDataUpdate> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).default('Ativo').required(),
    type: yup.string().oneOf(['Original', 'Print']).required(),
    title: yup.string().required().min(1).max(100),
    orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
    production_date: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('dateTest', value => {
            const limitDate = new Date(2018, 0, 1)

            if (!value) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'production_date')
            }

            //Verificando se a data é anterior a 2018
            const productDate = new Date(value)
            if (!(productDate >= limitDate)) {
                throw new yup.ValidationError('Não são aceitos produtos antes de 2018!', value, 'production_date')
            }

            //Verificando se a data é maior que hoje
            const currentDate = new Date()
            if (!(productDate <= currentDate)) {
                throw new yup.ValidationError('A data não pode ser maior que a data atual!', value, 'production_date')
            }

            return true
        })
        .required(),
    description: yup.string().optional(),
    dimension_id: yup.number().moreThan(0).required(),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
    quantity: yup.number().test('quantity-conditional-validation', 'A quantidade deve ser maior que zero!', function (value) {

        if (typeof value === 'number' && value > 1000) {
            return this.createError({
                path: this.path,
                message: 'Quantiddade max: 1000!',
            })
        } else if (typeof value === 'number' && value < 0) {
            return this.createError({
                path: this.path,
                message: 'A quantidade não pode ser negativa!',
            })
        }

        const status = this.resolve(yup.ref('status'))
        const type = this.resolve(yup.ref('type'))

        if (status === 'Ativo') {
            if (typeof value === 'number' && value > 0) {

                //Se for do tipo Original só pode ter uma unidade
                if (type === 'Original' && value > 1) {
                    return this.createError({
                        path: this.path,
                        message: 'Originais podem ter apenas 1 und!',
                    })
                }

                return true
            } else {
                return this.createError({
                    path: this.path,
                    message: 'A quantidade deve ser maior que zero!',
                })
            }
        } else if (status === 'Vendido') {
            if (typeof value === 'number' && value > 0) {
                return this.createError({
                    path: this.path,
                    message: 'Produtos vendidos precisam ter 0 und!',
                })
            }
        } else if (status === 'Inativo') {
            if (typeof value === 'number' && value > 0) {
                //Se for do tipo Original só pode ter uma unidade
                if (type === 'Original' && value > 1) {
                    return this.createError({
                        path: this.path,
                        message: 'Originais podem ter apenas 1 und!',
                    })
                }

                return true
            }
        }
        
        return true
    }).required(),
    price: yup.number().moreThan(0).max(1000000, 'Valor max: 1.000.000').required(),
    weight: yup.number().moreThan(0).min(5, 'Peso min: 5(g) = 0,005(kg)').max(5000, 'Peso max: 5000(g) = 5(kg)').required(),
})


