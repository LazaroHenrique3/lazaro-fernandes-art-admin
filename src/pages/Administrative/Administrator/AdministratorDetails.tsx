import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import * as yup from 'yup'

import { useAuthContext } from '../../../shared/contexts'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools } from '../../../shared/components'
import { AdministratorService } from '../../../shared/services/api/administrator/AdministratorService'
import { VTextField, VForm, useVForm, IVFormErrors, VSelect } from '../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    IFormData,
    IFormDataUpdate,
    formatValidationSchema,
    formatValidationSchemaUpdate
} from './validation/Schemas'

export const AdministratorDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const [isAlterPassword, setIsAlterPassword] = useState(false)

    const { idUser, handleName, accessLevel } = useAuthContext()

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await AdministratorService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/administrator')
                    return
                }

                setName(result.name)
                formRef.current?.setData(result)
            } else {
                formRef.current?.setData({
                    name: '',
                    email: ''
                })
            }

            return
        }

        fetchData()

    }, [id])

    const handleSave = async (data: IFormData) => {
        try {

            let validateData: IFormData | IFormDataUpdate

            //Verificando se é update ou novo
            if (id === 'new' || !isAlterPassword) {
                validateData = await formatValidationSchema.validate(data, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate(data, { abortEarly: false })
            }

            setIsLoading(true)

            if (id === 'new') {
                const result = await AdministratorService.create(validateData)
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')

                    if (accessLevel !== undefined && accessLevel === 'Root') {
                        navigate(`/admin/administrator/details/${result}`)
                        return
                    }

                    navigate('/admin/administrator')
                }
            } else {
                const result = await AdministratorService.updateById(Number(id), { id: Number(id), ...validateData })
                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                //Significa que é o usuario logado que está alterando suas próprias informações
                if (Number(id) === Number(idUser)) {
                    handleName(data.name)
                    localStorage.setItem('APP_USER_NAME', JSON.stringify(data.name))
                }

                toast.success('Registro salvo com sucesso!')
                setIsAlterPassword(false)
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
            const result = await AdministratorService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/administrator')
        }
    }

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