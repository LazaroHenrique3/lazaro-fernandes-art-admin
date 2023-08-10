import * as yup from 'yup'

import { cpf } from 'cpf-cnpj-validator'

export interface IFormData {
    status: 'Ativo' | 'Inativo'
    image?: FileList
    name: string
    email: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
} 

export interface IFormDataUpdate {
    status: 'Ativo' | 'Inativo'
    name: string
    email: string
    password: string
    confirmPassword: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}

//Definindo o schema para validação
/* export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
    name: yup.string().required().min(3).max(100),
    email: yup.string().required().email().min(5).max(100),
    password: yup.string().required().min(6).max(256),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required(),
    cell_phone: yup.string().length(11).matches(/^\d{11}$/, 'O valor deve corresponder ao padrão: 44999999999').required(),
    genre: yup.string().length(1).oneOf(['M', 'F', 'L', 'N']).required(),
    date_of_birth: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('dateTest', value => {

            if (!value) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'date_of_birth')
            }

            //Verificando se é de maior
            const currentDate = new Date()
            const eighteenYearsAgo = new Date(
                currentDate.getFullYear() - 18,
                currentDate.getMonth(),
                currentDate.getDate()
            )

            const customerBirth = new Date(value)
            if (!(customerBirth < eighteenYearsAgo)) {
                throw new yup.ValidationError('O usuário deve ter mais de 18 anos!', value, 'date_of_birth')
            }

            //Verificando se a data é maior que hoje
            if (!(customerBirth <= currentDate)) {
                throw new yup.ValidationError('A data não pode ser maior que a data atual!', value, 'date_of_birth')
            }

            return true
        })
        .required(),
    cpf: yup.string().test('valid-cpf', 'CPF inválido', function (value) {
        if (!value) {
            return false
        }

        return cpf.isValid(value)
    }).required(),
    image: yup.mixed()
        .test('isImage', (value) => {

            if (value === undefined) {
                return true
            }

            const image: FileList = value as FileList

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            if (!supportedFormats.includes(image[0].type)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'image')
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            if (Number(image[0].size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'image')
            }

            return true
        })
        .nullable()
        .optional() as yup.Schema<FileList>,
}) */

export const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
    name: yup.string().required().min(3).max(100),
    email: yup.string().required().email().min(5).max(100),
    cell_phone: yup.string().length(11).matches(/^\d{11}$/, 'Deve corresponder ao padrão: (44) 99999-9999').required(),
    genre: yup.string().length(1).oneOf(['M', 'F', 'L', 'N']).required(),
    date_of_birth: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('dateTest', value => {

            if (!value) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'date_of_birth')
            }

            //Verificando se é de maior
            const currentDate = new Date()
            const eighteenYearsAgo = new Date(
                currentDate.getFullYear() - 18,
                currentDate.getMonth(),
                currentDate.getDate()
            )

            const customerBirth = new Date(value)
            if (!(customerBirth < eighteenYearsAgo)) {
                throw new yup.ValidationError('O usuário deve ter mais de 18 anos!', value, 'date_of_birth')
            }

            //Verificando se a data é maior que hoje
            if (!(customerBirth <= currentDate)) {
                throw new yup.ValidationError('A data não pode ser maior que a data atual!', value, 'date_of_birth')
            }

            return true
        })
        .required(),
    cpf: yup.string().test('valid-cpf', 'CPF inválido', function (value) {
        if (!value) {
            return false
        }

        return cpf.isValid(value)
    }).required(),
}) 

//Definindo o schema para validação de atualização
export const formatValidationSchemaUpdate: yup.Schema<IFormDataUpdate> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Inativo']).required(),
    name: yup.string().required().min(3).max(100),
    email: yup.string().required().email().min(5).max(100),
    password: yup.string().required().min(6),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required(),
    cell_phone: yup.string().length(11).matches(/^\d{11}$/, 'Deve corresponder ao padrão: (44) 99999-9999').required(),
    genre: yup.string().length(1).oneOf(['M', 'F', 'L', 'N']).required(),
    date_of_birth: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('dateTest', value => {

            if (!value) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'date_of_birth')
            }

            //Verificando se é de maior
            const currentDate = new Date()
            const eighteenYearsAgo = new Date(
                currentDate.getFullYear() - 18,
                currentDate.getMonth(),
                currentDate.getDate()
            )

            const customerBirth = new Date(value)
            if (!(customerBirth < eighteenYearsAgo)) {
                throw new yup.ValidationError('O usuário deve ter mais de 18 anos!', value, 'date_of_birth')
            }

            //Verificando se a data é maior que hoje
            if (!(customerBirth <= currentDate)) {
                throw new yup.ValidationError('A data não pode ser maior que a data atual!', value, 'date_of_birth')
            }

            return true
        })
        .required(),
    cpf: yup.string().test('valid-cpf', 'CPF inválido', function (value) {
        if (!value) {
            return false
        }

        return cpf.isValid(value)
    }).required(),
}) 