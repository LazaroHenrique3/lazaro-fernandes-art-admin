import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Checkbox, FormControlLabel, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import { useAuthContext } from '../../shared/contexts'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'
import { VTextField, VForm, useVForm, VSelect } from '../../shared/forms'

//Hooks personalizados
import {
    UseFetchAdministratorData,
    UseHandleAdministrator
} from './hooks/detailsHooks'

export const AdministratorDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const [isAlterPassword, setIsAlterPassword] = useState(false)

    const { idUser, accessLevel } = useAuthContext()

    //Hooks personalizados de Customer
    UseFetchAdministratorData({setIsLoading, setName, formRef, id})

    const { handleSave, handleDelete } = UseHandleAdministrator({setIsLoading, setIsAlterPassword, setName, isAlterPassword, formRef, id})

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Novo administrador' : `'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={id !== 'new'}
                    showDeleteButton={accessLevel !== undefined && accessLevel === 'Root' && Number(id) !== Number(idUser) && id !== 'new'}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDelete(Number(id), name)}
                    onClickBackButton={() => navigate('/admin/administrator')}
                    onClickNewButton={() => navigate('/admin/administrator/details/new')}
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

                            {(accessLevel !== undefined && accessLevel === 'Root' && Number(id) !== Number(idUser) && id !== 'new') && (
                                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                    <VSelect
                                        fullWidth
                                        label='Status'
                                        name='status'
                                        options={[
                                            { value: 'Ativo', label: 'Ativo' },
                                            { value: 'Inativo', label: 'Inativo' },
                                        ]}
                                        disabled={isLoading} />
                                </Grid>
                            )}

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <VTextField fullWidth label='Nome' name='name' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                                <VTextField fullWidth label='Email' name='email' type='email' disabled={isLoading} />
                            </Grid>

                        </Grid>

                        {id !== 'new' && (
                            <Grid container item direction='row' spacing={2}>

                                <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                                    <FormControlLabel control={<Checkbox checked={isAlterPassword} onChange={() => setIsAlterPassword(!isAlterPassword)} />} label='Alterar senha' />
                                </Grid>

                            </Grid>
                        )}

                        {isAlterPassword && (
                            <Grid container item direction='row' spacing={2}>

                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <VTextField fullWidth label='Senha' name='password' type='password' disabled={isLoading} />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <VTextField fullWidth label='Confirmar Senha' name='confirmPassword' type='password' disabled={isLoading} />
                                </Grid>

                            </Grid>
                        )}

                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}