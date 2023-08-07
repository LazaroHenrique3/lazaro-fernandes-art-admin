import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, Grid, LinearProgress, Paper, Typography } from '@mui/material'

import * as yup from 'yup'

import { useAuthContext } from '../../../shared/contexts'

import { BasePageLayout } from '../../../shared/layouts'
import { DetailTools, ImageHandler } from '../../../shared/components'
import { CustomerService } from '../../../shared/services/api/customer/CustomerService'
import {
    VTextField,
    VForm,
    useVForm,
    IVFormErrors,
    VSelect,
    VDateInput,
    VTextFieldCPF,
    VTextFieldCellphone
} from '../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    IFormData,
    IFormDataUpdate,
    formatValidationSchema,
    formatValidationSchemaUpdate
} from './validation/Schemas'

export const CustomerDetails: React.FC = () => {
    const { id = 'new' } = useParams<'id'>()
    const navigate = useNavigate()

    const { formRef } = useVForm()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [image, setImage] = useState('')

    const [isAlterPassword, setIsAlterPassword] = useState(false)

    const { accessLevel } = useAuthContext()

    useEffect(() => {

        const fetchData = async () => {

            setIsLoading(true)
            const result = await CustomerService.getById(Number(id))

            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                navigate('/admin/customer')
                return
            }

            setName(result.name)
            setImage(result.image)
            formRef.current?.setData(result)
        }

        fetchData()

    }, [id])

    const handleSave = async (data: IFormDataUpdate) => {
        try {

            const cell_phone = data.cell_phone.replace(/[^\w]/g, '')
            const cpf = data.cpf.replace(/[^\w]/g, '')

            let validateData: IFormData | IFormDataUpdate

            //Verificando se é update ou novo
            if (id === 'new' || !isAlterPassword) {
                validateData = await formatValidationSchema.validate({ ...data, cell_phone, cpf }, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate({ ...data, cell_phone, cpf }, { abortEarly: false })
            }

            setIsLoading(true)

            const result = await CustomerService.updateById(Number(id), { id: Number(id), ...validateData })
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro salvo com sucesso!')
            setIsAlterPassword(false)
            setName(data.name)

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

    const handleInsertImage = async (newImage: FileList) => {

        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await CustomerService.insertNewImage(Number(id), formData)
        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        //preparando para atualizar o state de imagens
        const newImageCustomer = result.data

        setImage(newImageCustomer)
        toast.success('Imagem inserida com sucesso!')
    }

    const handleUpdateImage = async (id: number, newImage: FileList) => {

        setIsLoading(true)

        const [image] = newImage
        //convertendo em formdata
        const formData = new FormData()

        formData.append('image', image)

        const result = await CustomerService.updateCustomerImage(Number(id), formData)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        setImage(result.data)
        toast.success('Imagem atualizada com sucesso!')
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CustomerService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/customer')
        }
    }

    const handleDeleteImage = async () => {

        if (confirm('Realmente deseja apagar a imagem')) {

            setIsLoading(true)

            const result = await CustomerService.deleteCustomerImage(Number(id))
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            setImage('')
            toast.success('Imagem excluída com sucesso!')
        }

    }

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