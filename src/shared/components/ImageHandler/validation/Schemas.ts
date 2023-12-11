import * as yup from 'yup'
import { isValidDimensions, PRODUCT_IMAGE } from '../../../util/validationUtils'

interface IFormDataUpdateImage {
    image: FileList
}

//Definindo o schema para validar as imagens na hora de editar
export const formatValidationSchemaUpdateImage: yup.Schema<IFormDataUpdateImage> = yup.object().shape({
    image: yup.mixed()
        .test('isImage', (value) => {
            const mainImage: FileList = value as FileList

            // Obtendo a primeira imagem do FileList
            const image = mainImage[0]

            //Verificando se foi passado imagem
            if (mainImage.length === 0) {
                throw new yup.ValidationError('A imagem é obrigatória!', value, 'image')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedFormats.includes(mainImage[0].type)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'image')
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            if (Number(mainImage[0].size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'image')
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
                                'Ás dimensões deve ser entre (1070 a 1090 X 705 a 725)pixels.', value, 'image'
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
})