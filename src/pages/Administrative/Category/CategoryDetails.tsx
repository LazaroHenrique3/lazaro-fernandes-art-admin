import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import * as yup from 'yup'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { CategoryService } from '../../../shared/services/api/category/CategoryService'
import { VTextField, VForm, useVForm, IVFormErrors } from '../../../shared/forms'


interface IFormData {
    name: string
}

//Definindo o schema para validação
const formatValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).min(3).max(100).required(),
})

export const CategoryDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await CategoryService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    alert(result.message)
                    navigate('/category')
                    return
                }

                setName(result.name)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    name: ''
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
                const result = await CategoryService.create(validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    alert(result.message)
                } else {
                    navigate(`/category/details/${result}`)
                }
            } else {
                const result = await CategoryService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)

                if (result instanceof Error) {
                    alert(result.message)
                }

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
        }
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CategoryService.deleteById(id)

            if (result instanceof Error) {
                alert(result.message)
                return
            }

            alert('Registro apagado com sucesso!')
            navigate('/category')
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
                    onClickBackButton={() => navigate('/category')}
                    onClickNewButton={() => navigate('/category/details/new')}
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
                                <VTextField fullWidth label='Nome' name='name' disabled={isLoading} />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}