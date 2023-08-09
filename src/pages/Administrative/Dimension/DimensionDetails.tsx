import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { VTextField, VForm, useVForm } from '../../../shared/forms'

//Hooks personalizados
import {
    UseFetchDimensionData,
    UseHandleDimension,
} from './hooks/detailsHooks'

export const DimensionDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [dimension, setDimension] = useState('')

    //Hooks personalizados
    UseFetchDimensionData({setIsLoading, setDimension, formRef, id})

    const { handleSave, handleDelete } = UseHandleDimension({setIsLoading, setDimension, formRef, id})
  
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