import * as yup from 'yup'
import { existsImage, isValidMainImageDimensions, isValidProductImageDimensions, isValidSize, isValidType } from '../../../util/validationUtils/product'

interface IFormDataUpdateImage {
    image: FileList
}

//Definindo o schema para validar a imagem principal na hora de editar
export const formatValidationSchemaUpdateMainImage: yup.Schema<IFormDataUpdateImage> = yup.object().shape({
    image: yup.mixed()
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

            //Verificando as dimensões recomendadas
            await isValidMainImageDimensions(image, value)

            return true
        })
        .required() as yup.Schema<FileList>,
})

// o schema para validar a do produto na hora de editar
export const formatValidationSchemaUpdateProductImage: yup.Schema<IFormDataUpdateImage> = yup.object().shape({
    image: yup.mixed()
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

            //Verificando as dimensões recomendadas
            await isValidProductImageDimensions(image, value)

            return true
        })
        .required() as yup.Schema<FileList>,
})



//Definindo o schema que será utilizado em caso d ealteração de imagem do Cliente
export const formatValidationSchemaUpdateCustomerImage: yup.Schema<IFormDataUpdateImage> = yup.object().shape({
    image: yup.mixed()
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

            return true
        })
        .required() as yup.Schema<FileList>,
})