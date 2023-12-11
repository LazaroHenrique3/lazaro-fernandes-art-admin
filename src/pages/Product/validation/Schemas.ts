import * as yup from 'yup'

import {
    TProductOrientation,
    TProductStatus,
    TProductType
} from '../../../shared/services/api/product/ProductService'
import { isValidDimensions, MAX_PRODUCT_IMAGES, PRODUCT_IMAGE } from '../../../shared/util/validationUtils'


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
        .test('isImage', (value) => {
            const mainImage: FileList = value as FileList

            // Obtendo a primeira imagem do FileList
            const image = mainImage[0]

            //Verificando se foi passado imagem
            if (mainImage.length === 0) {
                throw new yup.ValidationError('A imagem é obrigatória!', value, 'main_image')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedFormats.includes(image.type)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'main_image')
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            if (Number(image.size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'main_image')
            }

            //Verificando as dimensões recomendadaas
            // Criando um URL temporário para a imagem
            const imageUrl = URL.createObjectURL(image)

            // Criando uma promessa para lidar com a carga da imagem
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = imageUrl

                img.onload = () => {
                    // Dimensões estão corretas
                    if (isValidDimensions(
                        PRODUCT_IMAGE.MAX_W_MAIN_IMAGE, 
                        PRODUCT_IMAGE.MAX_H_MAIN_IMAGE, 
                        PRODUCT_IMAGE.MIN_W_MAIN_IMAGE, 
                        PRODUCT_IMAGE.MIN_H_MAIN_IMAGE, 
                        img.height, 
                        img.width)) {
                        resolve(true)
                    } else {
                        // Dimensões não correspondem às recomendadas
                        reject(
                            new yup.ValidationError(
                                'Ás dimensões deve ser entre (1070 a 1090 X 705 a 725)pixels.', value, 'main_image'
                            )
                        )
                    }

                    // Liberar o URL temporário após o uso
                    URL.revokeObjectURL(imageUrl)
                }

                return true
            })
        })
        .required() as yup.Schema<FileList>,
    product_images: yup.mixed()
        .test('isImage', async (value) => {
            const product_images: FileList = value as FileList

            //Verificando se foi passado imagem e se é mais que  o permitido
            if (product_images.length === 0) {
                throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
            } else if (product_images.length > MAX_PRODUCT_IMAGES) {
                throw new yup.ValidationError(`É permitido o upload de até ${MAX_PRODUCT_IMAGES} imagens!`, value, 'product_images')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (!supportedFormats.includes(image.type)) {
                    throw new yup.ValidationError('Formato de imagem inválido!', value, 'product_images')
                }
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (Number(image.size) > maxSize) {
                    throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'product_images')
                }
            }

            const validationPromises = []

            //Verificando as dimensões recomendadaas
            for (let i = 0; i < product_images.length; i++) {
                // Criando um URL temporário para a imagem
                const imageUrl = URL.createObjectURL(product_images[i])

                // Criando uma promessa para lidar com a carga da imagem
                const validationPromise = new Promise((resolve, reject) => {
                    const img = new Image()
                    img.src = imageUrl

                    img.onload = () => {
                        // Dimensões estão corretas
                        if (isValidDimensions(  
                            PRODUCT_IMAGE.MAX_W_MAIN_IMAGE, 
                            PRODUCT_IMAGE.MAX_H_MAIN_IMAGE, 
                            PRODUCT_IMAGE.MIN_W_MAIN_IMAGE, 
                            PRODUCT_IMAGE.MIN_H_MAIN_IMAGE, 
                            img.height, 
                            img.width)) {
                            resolve(true)
                        } else {
                            // Dimensões não correspondem às recomendadas
                            reject(
                                new yup.ValidationError(
                                    'Ás dimensões deve ser entre (690 a 710 X 720 a 740)pixels.', value, 'product_images'
                                )
                            )
                        }

                        // Liberar o URL temporário após o uso
                        URL.revokeObjectURL(imageUrl)
                    }
                })

                //Adicionando ao array que esta armazenando todas as promisses
                validationPromises.push(validationPromise)
            }

            //Executando todas as promisses que vai validar cada uma das imagens
            await Promise.all(validationPromises)

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
        }
        return true
    }).required(),
    price: yup.number().moreThan(0).max(1000000, 'Valor max: 1.000.000').required(),
    weight: yup.number().moreThan(0).min(5, 'Peso min: 5(g) = 0,005(kg)').max(5000, 'Peso max: 5000(g) = 5(kg)').required(),
})



