import * as yup from 'yup'

export interface IFormData {
    status: 'Ativo' | 'Vendido' | 'Inativo'
    title: string
    orientation: 'Retrato' | 'Paisagem'
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
    status: 'Ativo' | 'Vendido' | 'Inativo'
    title: string
    orientation: 'Retrato' | 'Paisagem'
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    dimension_id: number
    technique_id: number
    category_id: number
}

const MAX_PRODUCT_IMAGES = 4

//Definindo o schema para validação default com as informações de venda(price, weight, quantity)
export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).default('Ativo').required(),
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

            //Verificando se foi passado imagem
            if (mainImage.length === 0) {
                throw new yup.ValidationError('A imagem é obrigatória!', value, 'main_image')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedFormats.includes(mainImage[0].type)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'main_image')
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            if (Number(mainImage[0].size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'main_image')
            }

            return true
        })
        .required() as yup.Schema<FileList>,
    product_images: yup.mixed()
        .test('isImage', (value) => {
            const product_images: FileList = value as FileList

            //Verificando se foi passado imagem e se é mais que  o permitido
            if (product_images.length === 0) {
                throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
            } else if (product_images.length > MAX_PRODUCT_IMAGES ) {
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

            return true
        })
        .required() as yup.Schema<FileList>,
    dimension_id: yup.number().moreThan(0).required(),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
    quantity: yup.number().moreThan(0).required(),
    price: yup.number().moreThan(0).required(),
    weight: yup.number().moreThan(0).required(),
})

//Definindo o schema para validação default com as informações de venda(price, weight, quantity), além disso na alteração eu não envio as imagens
export const formatValidationSchemaUpdate: yup.Schema<IFormDataUpdate> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).default('Ativo').required(),
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
    quantity: yup.number().moreThan(0).required(),
    price: yup.number().moreThan(0).required(),
    weight: yup.number().moreThan(0).required(),
})
