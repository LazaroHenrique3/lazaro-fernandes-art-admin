import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
    Box,
    Grid,
    LinearProgress,
    Paper,
    Typography
} from '@mui/material'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'
import {
    VTextField,
    VTextFieldCEP,
    VForm,
    useVForm
} from '../../shared/forms'

//Hooks personalizados
import {
    UseFetchAddressData,
    UseHandleAddress,
} from './hooks/detailsHooks'

export const CustomerAddressDetails: React.FC = () => {
    const { id = 'new', idCustomer = '0', nameCustomer = '' } = useParams<'id' | 'idCustomer' | 'nameCustomer'>()
    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    //Hooks personalizados
    UseFetchAddressData({ setIsLoading, setName, formRef, id, idCustomer })

    const { handleGetInfoByCep, handleSave, handleDelete } = UseHandleAddress({ setIsLoading, setName, formRef, id, idCustomer, nameCustomer })

    return (
        <BasePageLayout
            title={(id === 'new') ? 'Novo endereço' : `'${name} - (${nameCustomer})'`}
            toolBar={
                <DetailTools
                    showSaveButton
                    newButtonText='Nova'
                    showNewButton={id !== 'new'}
                    showDeleteButton={id !== 'new'}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDelete(Number(id))}
                    onClickBackButton={() => navigate(`/admin/customer/customer-address/list/${idCustomer}/${nameCustomer}`)}
                    onClickNewButton={() => navigate(`/admin/customer/customer-address/details/${idCustomer}/new/${nameCustomer}`)}
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
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextFieldCEP label='CEP' disabled={isLoading} onBlur={(e) => handleGetInfoByCep(e.target.value)} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Cidade' name='city' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Estado' name='state' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Número' name='number' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Bairro' name='neighborhood' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Logradouro' name='street' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={6}>
                                <VTextField fullWidth multiline minRows={3} label='Complemento' name='complement' disabled={isLoading} />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>

        </BasePageLayout>
    )
}