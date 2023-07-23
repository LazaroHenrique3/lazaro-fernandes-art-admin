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
    useVForm,
    IVFormErrors,
} from '../../../shared/forms'

import { VAutoCompleteCategory } from './components/VAutoCompleteCategory'
import { VAutoCompleteTechnique } from './components/VAutoCompleteTechnique'
import { VAutoCompleteDimension } from './components/VAutoCompleteDimension'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface IFormData {
    status: 'Ativo' | 'Vendido' | 'Inativo'
    status_of_sale: 'Venda' | 'Galeria'
    title: string
    type: 'Original' | 'Print'
    orientation: 'Retrato' | 'Paisagem'
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: any
    dimensions: string[] | number[]
    product_images: any[]
    technique_id: number
    category_id: number
}

//Definindo o schema para validação
const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    status: yup.string().oneOf(['Ativo', 'Vendido', 'Inativo']).required(),
    status_of_sale: yup.string().oneOf(['Venda', 'Galeria']).required(),
    title: yup.string().required().min(1).max(100),
    type: yup.string().oneOf(['Original', 'Print']).required(),
    orientation: yup.string().oneOf(['Retrato', 'Paisagem']).required(),
    quantity: yup.number().moreThan(0).optional(),
    production_date: yup.date()
        .transform((currentValue, originalValue) => {
            if (originalValue && typeof originalValue === 'string') {
                const date = new Date(originalValue).toISOString().split('T')[0]

                const [year, month, day] = date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            }
            return currentValue
        })
        .test('before-2018', 'Não são aceitos produtos antes de 2018!', value => {
            const limitDate = new Date(2018, 0, 1)

            if (value) {
                const productDate = new Date(value)
                return productDate >= limitDate
            }

            return false
        })
        .test('before-today', 'A data não pode ser maior que hoje!', value => {
            const currentDate = new Date()

            if (value) {
                const productDate = new Date(value)

                return productDate <= currentDate
            }

            return false
        })
        .required(),
    description: yup.string().optional(),
    weight: yup.number().moreThan(0).optional(),
    price: yup.number().moreThan(0).optional(),
    main_image: yup.mixed().required().default([]),
    product_images: yup.array().required().default([]),
    dimensions: yup.array().of(yup.string().defined()).required(),
    technique_id: yup.number().moreThan(0).required(),
    category_id: yup.number().moreThan(0).required(),
})

export const ProductDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

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
        /*  try {
             const validateData = await formatValidationSchema.validate(data, { abortEarly: false })
 
             setIsLoading(true)
 
             if (id === 'new') {
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
             }
         } catch (errors) {
 
             const errorsYup: yup.ValidationError = errors as yup.ValidationError
 
             const validationErrors: IVFormErrors = {}
             
             errorsYup.inner.forEach(error => {
                 if (!error.path) return
 
                 validationErrors[error.path] = error.message
                 formRef.current?.setErrors(validationErrors)
             })
         } */
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

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Nova categoria' : `'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
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
                                <VInputFile label='Principal' name='main_image' isExternalLoading={isLoading}/>
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
                                    fullWidth
                                    label='Status'
                                    name='status_of_sale'
                                    options={[
                                        { value: 'Venda', label: 'Venda' },
                                        { value: 'Galeria', label: 'Galeria' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <VSelect
                                    fullWidth
                                    label='Tipo'
                                    name='type'
                                    options={[
                                        { value: 'Original', label: 'Original' },
                                        { value: 'Print', label: 'Print' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

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
                                <VAutoCompleteDimension isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                                <VTextField fullWidth multiline minRows={3} label='Descrição' name='description' disabled={isLoading} />
                            </Grid>
                        </Grid>

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
                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}