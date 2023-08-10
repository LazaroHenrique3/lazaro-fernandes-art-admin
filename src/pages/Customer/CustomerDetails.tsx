import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Checkbox, FormControlLabel, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import { useAuthContext } from '../../shared/contexts'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools, ImageHandler } from '../../shared/components'

import {
    VTextField,
    VForm,
    useVForm,
    VSelect,
    VDateInput,
    VTextFieldCPF,
    VTextFieldCellphone
} from '../../shared/forms'

//Hooks personalizados
import { 
    UseFetchCustomerData,
    UseHandleCustomer,
    UseHandleCustomerImage
} from './hooks/detailsHooks'

export const CustomerDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()

    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [image, setImage] = useState('')

    const [isAlterPassword, setIsAlterPassword] = useState(false)

    const { accessLevel } = useAuthContext()

    //Hooks personalizados de Customer
    UseFetchCustomerData({setIsLoading, setName, setImage, formRef, id})

    const { handleSave, handleDelete } = UseHandleCustomer({setIsLoading, setName, setIsAlterPassword, isAlterPassword, formRef, id})
    const { handleInsertImage, handleUpdateImage, handleDeleteImage } = UseHandleCustomerImage({setIsLoading, setImage, id})

    return (
        <BasePageLayout
            title={`'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={false}
                    showDeleteButton={true}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDelete(Number(id), name)}
                    onClickBackButton={() => navigate('/admin/customer')}
                    onClickNewButton={() => navigate('/admin/customer/details/new')}
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

                        {(image !== '') && (
                            <Grid container item direction='row' spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                    <ImageHandler
                                        handleDeleteImage={handleDeleteImage}
                                        handleUpdateImage={handleUpdateImage}
                                        isExternalLoading={isLoading}
                                        isInsertImage={false}
                                        urlImage={image}
                                        showDeleteButton={true}
                                        idImage={Number(id)}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {(image === '') && (
                            <>
                                <Grid item>
                                    <Typography variant='h6'>Imagem</Typography>
                                </Grid>

                                <Grid key={image} container item direction='row' spacing={2}>
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                        <ImageHandler
                                            handleInsertImage={handleInsertImage}
                                            isExternalLoading={isLoading}
                                            isInsertImage={true}
                                            urlImage={''}
                                            showDeleteButton={false}
                                            idImage={Number(id)}
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

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VTextField fullWidth label='Nome' name='name' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VTextField fullWidth label='Email' name='email' type='email' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VTextFieldCellphone disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VSelect
                                    fullWidth
                                    label='Gênero'
                                    name='genre'
                                    options={[
                                        { value: 'M', label: 'Masculino' },
                                        { value: 'F', label: 'Feminino' },
                                        { value: 'L', label: 'LGBTQIAPN+' },
                                        { value: 'N', label: 'Prefiro não dizer' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VDateInput label='Data de produção' name='date_of_birth' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                                <VTextFieldCPF disabled={isLoading} />
                            </Grid>

                        </Grid>

                        {accessLevel !== undefined && accessLevel === 'Root' && (
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