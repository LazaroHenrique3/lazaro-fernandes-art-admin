import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import * as yup from 'yup'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { DimensionService } from '../../../shared/services/api/dimension/DimensionService'
import { VTextField, VForm, useVForm, IVFormErrors } from '../../../shared/forms'
import {
    IFormData,
    formatValidationSchema
} from './validation/Schemas'

export const DimensionDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [dimension, setDimension] = useState('')

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await DimensionService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/dimension')
                    return
                }

                setDimension(result.dimension)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    dimension: ''
                })
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = async (data: IFormData) => {
        try {
            const validateData = await formatValidationSchema.validate(data, { abortEarly: false })

            setIsLoading(true)

            if (id === 'new') {
                const result = await DimensionService.create(validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/dimension/details/${result}`)
                }
            } else {
                const result = await DimensionService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                toast.success('Registro salvo com sucesso!')
                setDimension(data.dimension)
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

    const handleDelete = async (id: number, dimension: string) => {

        if (confirm(`Realmente deseja apagar "${dimension}"?`)) {
            const result = await DimensionService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/dimension')
        }
    }

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Nova técnica' : `'${dimension}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new'}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDelete(Number(id), dimension)}
                    onClickBackButton={() => navigate('/admin/dimension')}
                    onClickNewButton={() => navigate('/admin/dimension/details/new')}
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
                            <Typography variant='h6'>Geral</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField fullWidth label='Nome' name='dimension' disabled={isLoading} />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}