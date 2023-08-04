import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import * as yup from 'yup'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools, ImageHandler } from '../../../shared/components'
import { IDetailProductUpdate, IImageProductList, ProductService } from '../../../shared/services/api/product/ProductService'
import {
    VTextField,
    VSelect,
    VInputFile,
    VForm,
    VDateInput,
    useVForm,
    IVFormErrors,
} from '../../../shared/forms'

import {
    IFormData,
    IFormDataUpdate,
    formatValidationSchema,
    formatValidationSchemaUpdate
} from './validation/Schemas'

import { VAutoCompleteCategory } from './components/VAutoCompleteCategory'
import { VAutoCompleteTechnique } from './components/VAutoCompleteTechnique'
import { VAutoCompleteDimension } from './components/VAutoCompleteDimension'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const INITIAL_FORM_VALUES = {
    title: '',
    orientation: '',
    main_image: '',
    product_images: '',
    quantity: '',
    description: '',
    weight: '',
    price: '',
    dimension_id: '',
    technique_id: '',
    category_id: '',
}

const MAX_PRODUCT_IMAGES = 4

export const ProductDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState('')
    const [productId, setProductId] = useState(0)
    const [mainImage, setMainImage] = useState('')
    const [productImages, setProductImages] = useState<IImageProductList[]>([])

    useEffect(() => {

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

                const { main_image, product_images, ...resultData } = result

                setName(result.title)
                setProductId(result.id)
                setMainImage(main_image)
                setProductImages(product_images)

                formRef.current?.setData(resultData)
            } else {
                formRef.current?.setData(INITIAL_FORM_VALUES)
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = async (data: IFormData) => {
        try {
            let validateData: IFormData | IFormDataUpdate

            //Verificando se é update ou novo
            if (id === 'new') {
                validateData = await formatValidationSchema.validate(data, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate(data, { abortEarly: false })
            }

            setIsLoading(true)

            const formData = new FormData()
            formData.append('status', validateData.status)
            formData.append('title', validateData.title)
            formData.append('orientation', validateData.orientation)
            formData.append('production_date', String(validateData.production_date))
            formData.append('description', String(validateData.description))
            formData.append('dimension_id', String(validateData.dimension_id))
            formData.append('technique_id', String(validateData.technique_id))
            formData.append('category_id', String(validateData.category_id))
            formData.append('quantity', String(validateData.quantity))
            formData.append('weight', String(validateData.weight))
            formData.append('price', String(validateData.price))

            //Se for novo registro eu devo adicionar as imagens
            if (id === 'new' && 'main_image' in validateData && 'product_images' in validateData) {

                const [formattedMainImage] = validateData.main_image

                formData.append('main_image', formattedMainImage)

                // Adicionando as imagens do produto
                for (let i = 0; i < validateData.product_images.length; i++) {
                    formData.append('product_images', validateData.product_images[i])
                }

                const result = await ProductService.create(formData)

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/product/details/${result}`)
                }

            } else {

                const result = await ProductService.updateById(Number(id), validateData as IDetailProductUpdate)

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                toast.success('Registro salvo com sucesso!')
                setName(validateData.title)

            }

        } catch (errors) {

            const errorsYup: yup.ValidationError = errors as yup.ValidationError

            const validationErrors: IVFormErrors = {}

            errorsYup.inner.forEach(error => {
                if (!error.path) return

                validationErrors[error.path] = error.message
                formRef.current?.setErrors(validationErrors)
            })
        }
    }

    const handleInsertImage = async (newImage: FileList) => {

        if (productImages.length >= MAX_PRODUCT_IMAGES) {
            toast.error('O produto não poder ter mais que 4 imagens!')
            return
        }

        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await ProductService.insertNewImage(productId, formData)
        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        //preparando para atualizar o state de imagens
        const newImageObject = result.data

        const newProductImages = [...productImages, newImageObject]

        setProductImages(newProductImages as IImageProductList[])

        toast.success('Imagem inserida com sucesso!')
    }

    const handleUpdateProductImage = async (id: number, newImage: FileList) => {

        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await ProductService.updateProductImage(id, productId, formData)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }


        const newUrl = result.data

        //Atualizar o state com as imagens do produto, junto com a url retornada do servidor
        const indexImage = productImages.findIndex(image => image.id === id)

        if (indexImage !== -1) {
            const newProductImages = productImages.map((image, index) => {
                if (index === indexImage) {
                    // Atualize a propriedade 'url' da imagem no objeto encontrado
                    return { ...image, url: newUrl }
                }
                return image
            })

            setProductImages(newProductImages)
        } else {
            toast.error('Erro inesperado ao atualizar imagem!')
        }

        toast.success('Imagem atualizada com sucesso!')
    }

    const handleUpdateMainImage = async (id: number, newImage: FileList) => {

        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await ProductService.updateProductMainImage(id, formData)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        setMainImage(result.data)
        toast.success('Imagem atualizada com sucesso!')
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

    const handleDeleteImage = async (id: number) => {

        if (productImages.length === 1) {
            toast.error('O produto precisa de no mínimo uma imagem!')
            return
        }

        if (confirm('Realmente deseja apagar a imagem')) {

            setIsLoading(true)

            const result = await ProductService.deleteProductImage(id, productId)
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            //preparando para atualizar o state de imagens
            const newProductImages = productImages.filter((image) => image.id !== id)
            setProductImages(newProductImages)

            toast.success('Imagem excluída com sucesso!')
        }

    }

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

                        {id === 'new' ? (
                            <>
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
                            </>
                        ) : (
                            <Grid container item direction='row' spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <ImageHandler
                                        handleUpdateImage={handleUpdateMainImage}
                                        isExternalLoading={isLoading}
                                        isInsertImage={false}
                                        urlImage={mainImage}
                                        showDeleteButton={false}
                                        idImage={productId}
                                    />
                                </Grid>

                                {productImages.map((image) => (
                                    <Grid key={image.id}
                                        item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <ImageHandler
                                            handleDeleteImage={handleDeleteImage}
                                            handleUpdateImage={handleUpdateProductImage}
                                            isExternalLoading={isLoading}
                                            isInsertImage={false}
                                            urlImage={image.url}
                                            showDeleteButton={(productImages.length > 1)}
                                            idImage={image.id}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {(productImages.length < 4 && id !== 'new') && (
                            <>
                                <Grid item>
                                    <Typography variant='h6'>Imagem</Typography>
                                </Grid>

                                <Grid key={productImages.length} container item direction='row' spacing={2}>
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <ImageHandler
                                            handleInsertImage={handleInsertImage}
                                            isExternalLoading={isLoading}
                                            isInsertImage={true}
                                            urlImage={''}
                                            showDeleteButton={false}
                                            idImage={productId}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        <Grid item>
                            <Typography variant='h6'>Geral</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VTextField fullWidth label='Título' name='title' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VAutoCompleteCategory isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VAutoCompleteTechnique isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
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

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VAutoCompleteDimension isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VDateInput label='Data de produção' name='production_date' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField fullWidth type='number' label='Quantidade' name='quantity' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField fullWidth type='number' label='Peso' name='weight' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField fullWidth type='number' label='Preço' name='price' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <VTextField fullWidth multiline minRows={3} label='Descrição' name='description' disabled={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </VForm>

        </BasePageLayout>
    )
}