import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Button, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import * as yup from 'yup'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { ProductService } from '../../../shared/services/api/product/ProductService'
import {
    VTextField,
    VSelect,
    VInputFile,
    VForm,
    VDateInput,
    useVForm,
    IVFormErrors,
} from '../../../shared/forms'

import { VAutoCompleteCategory } from './components/VAutoCompleteCategory'
import { VAutoCompleteTechnique } from './components/VAutoCompleteTechnique'
import { VAutoCompleteDimension } from './components/VAutoCompleteDimension'
import { VAutoCompleteDimensionMultiple } from './components/VAutoCompleteDimensionMultiple'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface IFormData {
    status: 'Ativo' | 'Vendido' | 'Inativo'
    status_of_sale: 'Venda' | 'Galeria'
    title: string
    type: 'Original' | 'Print' | 'Galeria'
    orientation: 'Retrato' | 'Paisagem'
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: any
    dimensions: number[]
    technique_id: number
    category_id: number
}

//Definindo o schema para validação default
const formatValidationSchemaOne: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
    status_of_sale: yup.string().oneOf(['Venda', 'Galeria', 'Galeria']).required(),
    title: yup.string().required().min(1).max(100),
    type: yup.string().oneOf(['Original', 'Print']).required(),
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
        .required(),
    product_images: yup.mixed()
        .test('isImage', (value) => {
            const product_images: FileList = value as FileList

            //Verificando se foi passado imagem e se é mais que  o permitido
            if (product_images.length === 0) {
                console.log('ProductImages - As imagens são obrigatórias!: ',)
                throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
            } else if (product_images.length > 4) {
                console.log('ProductImages - É permitido o upload de até 4 imagens!: ',)
                throw new yup.ValidationError('É permitido o upload de até 4 imagens!', value, 'product_images')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (!supportedFormats.includes(image.type)) {
                    console.log('ProductImages - Formato de imagem inválido!: ',)
                    throw new yup.ValidationError('Formato de imagem inválido!', value, 'product_images')
                }
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (Number(image.size) > maxSize) {
                    console.log('ProductImages - Tamanho de imagem excede 2MB!: ',)
                    throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'product_images')
                }
            }

            return true
        })
        .required(),
    dimensions: yup.array().of(yup.number().defined())
        .required()
        .test('testDimensions', (value) => {
            if (value?.length === 0 || value === undefined) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'dimensions')
            }

            for (let i = 0; i < value?.length; i++) {
                if (typeof value[i] !== 'number') {
                    throw new yup.ValidationError('Tipo de dado inválido!', value, 'dimensions')
                }
            }

            return true
        }),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
    quantity: yup.number().moreThan(0).required(),
    price: yup.number().moreThan(0).required(),
    weight: yup.number().moreThan(0).required(),
})

//Definindo o schema para validação quando for do tipo galeria
const formatValidationSchemaTwo: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
    status_of_sale: yup.string().oneOf(['Venda', 'Galeria']).required(),
    title: yup.string().required().min(1).max(100),
    type: yup.string().oneOf(['Original', 'Print', 'Galeria']).required(),
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
        .required(),
    product_images: yup.mixed()
        .test('isImage', (value) => {
            const product_images: FileList = value as FileList

            //Verificando se foi passado imagem e se é mais que  o permitido
            if (product_images.length === 0) {
                console.log('ProductImages - As imagens são obrigatórias!: ',)
                throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
            } else if (product_images.length > 4) {
                console.log('ProductImages - É permitido o upload de até 4 imagens!: ',)
                throw new yup.ValidationError('É permitido o upload de até 4 imagens!', value, 'product_images')
            }

            //Verificando o formato das imagens
            const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (!supportedFormats.includes(image.type)) {
                    console.log('ProductImages - Formato de imagem inválido!: ',)
                    throw new yup.ValidationError('Formato de imagem inválido!', value, 'product_images')
                }
            }

            // Verifica se o tamanho da imagem é maior que 2MB (em bytes)
            const maxSize = 2 * 1024 * 1024 // 2MB
            for (let i = 0; i < product_images.length; i++) {
                const image = product_images[i]
                if (Number(image.size) > maxSize) {
                    console.log('ProductImages - Tamanho de imagem excede 2MB!: ',)
                    throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'product_images')
                }
            }

            return true
        })
        .required(),
    dimensions: yup.array().of(yup.number().defined())
        .required()
        .test('testDimensions', (value) => {
            if (value?.length === 0 || value === undefined) {
                throw new yup.ValidationError('Este campo é obrigatório!', value, 'dimensions')
            }

            for (let i = 0; i < value?.length; i++) {
                if (typeof value[i] !== 'number') {
                    throw new yup.ValidationError('Tipo de dado inválido!', value, 'dimensions')
                }
            }

            return true
        }),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
})

export const ProductDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const [isSale, setIsSale] = useState<boolean>(true)
    const [isPrint, setIsPrint] = useState<boolean>(false)
    const [isGalery, setIsGalery] = useState<boolean>(false)

    /* useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await ProductService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/product')
                    return
                }

                setName(result.name)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    name: ''
                    category_id: undefined
                })
            }

            return
        }

        fetchData()

    }, [id]) */

    const handleSave = async (data: IFormData) => {
        console.log(data)
        try {

            let validateData
            if (isSale) {
                validateData = await formatValidationSchemaOne.validate(data, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaTwo.validate(data, { abortEarly: false })
            }

            setIsLoading(true)

            /* if (id === 'new') {
                const result = await ProductService.create(validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/product/details/${result}`)
                }
            } else {
                const result = await ProductService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                toast.success('Registro salvo com sucesso!')
                setName(data.name)
            } */
        } catch (errors) {

            const errorsYup: yup.ValidationError = errors as yup.ValidationError

            const validationErrors: IVFormErrors = {}
            console.log('ErrorYUP: ', errorsYup.inner)
            errorsYup.inner.forEach(error => {
                if (!error.path) return

                validationErrors[error.path] = error.message
                formRef.current?.setErrors(validationErrors)
            })
        }
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await ProductService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/product')
        }
    }

    console.log('isPrint', isPrint)
    return (
        <BasePageLayout
            title={(id === 'new') ? 'Novo produto' : `'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Novo'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new'}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDelete(Number(id), name)}
                    onClickBackButton={() => navigate('/admin/product')}
                    onClickNewButton={() => navigate('/admin/product/details/new')}
                />
            }>


            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

                    <Grid container direction='column' padding={2} spacing={2}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant='h6'>Imagens</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VInputFile label='Principal' name='main_image' isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <VInputFile label='Imagens do Produto' name='product_images' multiple isExternalLoading={isLoading} />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant='h6'>Geral</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VTextField fullWidth label='Título' name='title' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VSelect
                                    changeExternalState={(status) => setIsSale(status === 'Venda')}
                                    fullWidth
                                    label='Status'
                                    name='status_of_sale'
                                    options={[
                                        { value: 'Venda', label: 'Venda' },
                                        { value: 'Galeria', label: 'Galeria' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            {isSale && (
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                    <VSelect
                                        changeExternalState={(status) => setIsPrint(status === 'Print')}
                                        fullWidth
                                        label='Tipo'
                                        name='type'
                                        options={[
                                            { value: 'Original', label: 'Original' },
                                            { value: 'Print', label: 'Print' },
                                        ]}
                                        disabled={isLoading} />
                                </Grid>
                            )}

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VAutoCompleteCategory isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VAutoCompleteTechnique isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VSelect
                                    fullWidth
                                    label='Orientação'
                                    name='orientation'
                                    options={[
                                        { value: 'Retrato', label: 'Retrato' },
                                        { value: 'Paisagem', label: 'Paisagem' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                                {(isPrint && !isGalery) ? (
                                    <VAutoCompleteDimensionMultiple isExternalLoading={isLoading} />
                                ) : (
                                    <VAutoCompleteDimension isExternalLoading={isLoading} />
                                )}
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VDateInput label='Data de produção' name='production_date' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VTextField fullWidth multiline minRows={3} label='Descrição' name='description' disabled={isLoading} />
                            </Grid>
                        </Grid>

                        {isSale && (
                            <>
                                <Grid item>
                                    <Typography variant='h6'>Venda</Typography>
                                </Grid>

                                <Grid container item direction='row' spacing={2}>
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <VTextField fullWidth type='number' label='Quantidade' name='quantity' disabled={isLoading} />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <VTextField fullWidth type='number' label='Peso' name='weight' disabled={isLoading} />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <VTextField fullWidth type='number' label='Preço' name='price' disabled={isLoading} />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}