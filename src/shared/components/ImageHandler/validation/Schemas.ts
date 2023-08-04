import * as yup from 'yup'

interface IFormDataUpdateImage {
    image: FileList
}

//Definindo o schema para validar as imagens na hora de editar
export const formatValidationSchemaUpdateImage: yup.Schema<IFormDataUpdateImage> = yup.object().shape({
    image: yup.mixed()
        .test('isImage', (value) => {
            const mainImage: FileList = value as FileList

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

            return true
        })
        .required() as yup.Schema<FileList>,
})