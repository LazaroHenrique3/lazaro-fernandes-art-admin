import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
    Box,
    Grid,
    LinearProgress,
    Paper,
    Typography
} from '@mui/material'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { VTextField, VForm, useVForm } from '../../../shared/forms'

//Hooks personalizados
import {
    UseFetchCategoryData,
    UseHandleCategory,
} from './hooks/detailsHooks'

export const CategoryDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    //Hooks personalizados
    UseFetchCategoryData({ setIsLoading, setName, formRef, id })

    const { handleSave, handleDelete } = UseHandleCategory({ setIsLoading, setName, formRef, id })

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
                    onClickBackButton={() => navigate('/admin/category')}
                    onClickNewButton={() => navigate('/admin/category/details/new')}
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