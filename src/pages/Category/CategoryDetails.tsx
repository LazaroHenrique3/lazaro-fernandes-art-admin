import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import * as yup from 'yup'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'
import { CategoryService } from '../../shared/services/api/category/CategoryService'
import { VTextField } from '../../shared/forms'


interface IFormData {
    name: string
}

//Definindo o schema para validação
const categorySchema = yup.object<IFormData>().shape({
    name: yup.string().transform(value => (value ? value.trim() : '')).required().min(3).max(100),
})

export const CategoryDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const formRef = useRef<FormHandles>(null)

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
                }

                setName(result.name)
                formRef.current?.setData(result)
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = async (data: IFormData) => {
        setIsLoading(true)

        if (id === 'new') {
            const result = await CategoryService.create(data)
            setIsLoading(false)

            if (result instanceof Error) {
                alert(result.message)
            } else {
                navigate(`/category/details/${result}`)
            }
        } else {
            const result = await CategoryService.updateById(Number(id), { id: Number(id), ...data })
            setIsLoading(false)

            if (result instanceof Error) {
                alert(result.message)
            }

            setName(data.name)
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
            title={(id === 'new') ? 'Nova categoria' : `Alterar '${name}'`}
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

            <Form ref={formRef} onSubmit={handleSave}>
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
            </Form>

        </BasePageLayout>
    )
}