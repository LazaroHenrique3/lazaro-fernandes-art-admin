import * as yup from 'yup'

//Número máximo de imagens para upload
export const MAX_PRODUCT_IMAGES = 4

//Tamanhos recomendados em pixels
const MIN_H_MAIN_IMAGE = 1070
const MAX_H_MAIN_IMAGE = 1090
const MIN_W_MAIN_IMAGE = 705
const MAX_W_MAIN_IMAGE = 725

const MIN_H_PRODUCT_IMAGES = 720
const MAX_H_PRODUCT_IMAGES = 740
const MIN_W_PRODUCT_IMAGES = 690
const MAX_W_PRODUCT_IMAGES = 710

//Verifica se de fato foi passado uma imagem
// eslint-disable-next-line 
export const existsImage = (imageLength: number, value: any | undefined): void => {
    if (imageLength === 0) {
        throw new yup.ValidationError('A imagem é obrigatória!', value, 'main_image')
    }
}

//Verifica se foi pasado imagens e se não excedeu o máximo d eimagens aceitas
// eslint-disable-next-line 
export const existsImagesAndIsSmallerThanMax = (imagesLength: number, value: any | undefined) => {
    if (imagesLength === 0) {
        throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
    } else if (imagesLength > MAX_PRODUCT_IMAGES) {
        throw new yup.ValidationError(`É permitido o upload de até ${MAX_PRODUCT_IMAGES} imagens!`, value, 'product_images')
    }
}

//Verifica se a imagem fornecida é do formato correto
// eslint-disable-next-line 
export const isValidType = (imageType: string | FileList, value: any | undefined): void => {
    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']

    //Caso esteja validando as imagens de produtos irá ser informado um array de FileList
    if (imageType instanceof FileList) {
        for (let i = 0; i < imageType.length; i++) {
            const image = imageType[i]
            if (!supportedFormats.includes(image.type)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'product_images')
            }
        }
    } else {
        if (!supportedFormats.includes(imageType as string)) {
            throw new yup.ValidationError('Formato de imagem inválido!', value, 'main_image')
        }
    }
}

//Verifica se a imagem respeita o tamanho limite em MB
// eslint-disable-next-line 
export const isValidSize = (imageSize: number | FileList, value: any | undefined): void => {
    const maxSize = 2 * 1024 * 1024 // 2MB

    //Caso esteja validando as imagens de produtos irá ser informado um array de FileList
    if (imageSize instanceof FileList) {
        for (let i = 0; i < imageSize.length; i++) {
            const image = imageSize[i]
            if (Number(image.size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'product_images')
            }
        }
    } else  {
        if (imageSize as number > maxSize) {
            throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'main_image')
        }
    }
}

//Verifica se as dimensões da imagem estão dentro do range aceito
// eslint-disable-next-line 
export const isValidMainImageDimensions = async (image: File, value: any | undefined): Promise<void | boolean> => {
    // Criando um URL temporário para a imagem
    const imageUrl = URL.createObjectURL(image)

    // Criando uma promessa para lidar com a carga da imagem
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = imageUrl

        img.onload = () => {
            // Dimensões estão corretas
            if (checkMainImageDimensions(img.height, img.width)) {
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
}

//Verifica se as dimensões de todas as imagens do produto estão dentro do range aceito
// eslint-disable-next-line 
export const isValidProductImagesDimensions = async (productImages: FileList, value: any | undefined): Promise<void> => {
    const validationPromises = []

    //Verificando as dimensões recomendadaas
    for (let i = 0; i < productImages.length; i++) {
        // Criando um URL temporário para a imagem
        const imageUrl = URL.createObjectURL(productImages[i])

        // Criando uma promessa para lidar com a carga da imagem
        const validationPromise = new Promise((resolve, reject) => {
            const img = new Image()
            img.src = imageUrl

            img.onload = () => {
                // Dimensões estão corretas
                if (checkProductImagesDimensions(img.height, img.width)) {
                    resolve(true)
                    return true
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

}

//Funções auxiliares
//Compara se as dimensões da imagem principal são válidas
const checkMainImageDimensions = (imageHeight: number, imageWidth: number): boolean => {
    return (imageHeight >= MIN_H_MAIN_IMAGE && imageHeight <= MAX_H_MAIN_IMAGE) && (imageWidth >= MIN_W_MAIN_IMAGE && imageWidth <= MAX_W_MAIN_IMAGE)
}

//Compara se as imagens do produto são válidas
const checkProductImagesDimensions = (imageHeight: number, imageWidth: number): boolean => {
    return (imageHeight >= MIN_H_PRODUCT_IMAGES && imageHeight <= MAX_H_PRODUCT_IMAGES) && (imageWidth >= MIN_W_PRODUCT_IMAGES && imageWidth <= MAX_W_PRODUCT_IMAGES)
}




