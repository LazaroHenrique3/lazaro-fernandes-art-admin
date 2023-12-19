import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
    Box,
    Grid,
    IconButton,
    Icon,
    LinearProgress,
    Paper,
    Tooltip,
    Typography
} from '@mui/material'

import { BasePageLayout } from '../../shared/layouts'
import { useAuthContext } from '../../shared/contexts'

import {
    DetailTools,
    ImageHandler
} from '../../shared/components'
import { IImageProductList, TProductStatus } from '../../shared/services/api/product/ProductService'
import {
    VTextField,
    VCurrencyField,
    VSelect,
    VInputFile,
    VForm,
    VDateInput,
    useVForm,
} from '../../shared/forms'


import { VAutoCompleteCategory } from './components/VAutoCompleteCategory'
import { VAutoCompleteTechnique } from './components/VAutoCompleteTechnique'
import { VAutoCompleteDimension } from './components/VAutoCompleteDimension'

//Hooks personalizados
import {
    UseFetchProductData,
    UseHandleProduct,
    UseHandleProductImage
} from './hooks/detailsHooks'

export const ProductDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState('')
    const [productId, setProductId] = useState(0)
    const [productStatus, setProductStatus] = useState<TProductStatus>('' as TProductStatus)
    const [mainImage, setMainImage] = useState('')
    const [productImages, setProductImages] = useState<IImageProductList[]>([])

    //Descobrindo o nível de acesso do usuaário logado
    const { accessLevel } = useAuthContext()
    const userIsRoot = (accessLevel !== undefined && accessLevel === 'Root') ? true : false

    //Hooks personalizados
    UseFetchProductData({ setIsLoading, setName, setProductId, setMainImage, setProductImages, setProductStatus, formRef, id })

    const { handleDelete, handleSave } = UseHandleProduct({ setIsLoading, setName, setProductStatus, formRef, id })
    const {
        handleInsertImage,
        handleUpdateProductImage,
        handleUpdateMainImage,
        handleDeleteImage }
        = UseHandleProductImage({ setIsLoading, setProductImages, setMainImage, productImages, productId })

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Novo produto' : `'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Novo'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new' && productStatus !== 'Vendido'}

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
                            <Typography variant='h6'>
                                Imagens

                                <Tooltip title="Dimensões recomendadas: Imagem Principal(705px X 1070px | 715px X 1080px | 725px X 1090x) 
                                - Imagens do Produto(690px X 720px | 700px X 730px | 720px X 740px)">
                                    <IconButton>
                                        <Icon>info_icon</Icon>
                                    </IconButton>
                                </Tooltip>
                            </Typography>
                        </Grid>

                        {id === 'new' ? (
                            <Grid container item direction='row' spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <VInputFile label='Principal' name='main_image' isExternalLoading={isLoading} />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <VInputFile label='Imagens do Produto' name='product_images' multiple isExternalLoading={isLoading} />
                                </Grid>
                            </Grid>
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
                                    <Typography variant='h6'> Imagem </Typography>
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
                            {(id !== 'new') && (
                            //Só pode ser alterado por usuários Root
                                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                    <VSelect
                                        fullWidth
                                        readOnly={!userIsRoot}
                                        label={`Status ${!userIsRoot && '🚫'}`}
                                        name='status'
                                        options={[
                                            { value: 'Ativo', label: 'Ativo' },
                                            { value: 'Vendido', label: 'Vendido' },
                                            { value: 'Inativo', label: 'Inativo' }
                                        ]}
                                        disabled={isLoading} />
                                </Grid>
                            )}

                            {/* Só pode ser alterado por usuários Root */}
                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VSelect
                                    fullWidth
                                    readOnly={(!userIsRoot && id !== 'new')}
                                    label={`Tipo ${(!userIsRoot && id !== 'new') && '🚫'}`}
                                    name='type'
                                    options={[
                                        { value: 'Original', label: 'Original' },
                                        { value: 'Print', label: 'Print' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

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

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={(id === 'new') ? 3 : 2}>
                                <VTextField
                                    fullWidth
                                    type='number'
                                    label='Quantidade'
                                    name='quantity'
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                            max: 1000
                                        },
                                    }}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={(id === 'new') ? 3 : 2}>
                                <VTextField
                                    fullWidth type='number'
                                    label='Peso(g)'
                                    name='weight'
                                    InputProps={{
                                        inputProps: {
                                            min: 5,
                                            max: 5000
                                        },
                                    }}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={(id === 'new') ? 3 : 2}>
                                <VCurrencyField
                                    fullWidth
                                    label='Preço'
                                    name='price'
                                    disabled={isLoading} />
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