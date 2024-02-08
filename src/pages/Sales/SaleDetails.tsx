import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
    Box,
    Grid,
    LinearProgress,
    Paper,
    Typography,
} from '@mui/material'

import {
    ISaleItemsList,
    TSaleStatus
} from '../../shared/services/api/sales/SaleService'

import {
    IListAddress
} from '../../shared/services/api/address/AddressService'

import {
    IListCustomer
} from '../../shared/services/api/customer/CustomerService'

import {
    SaleInfoSection,
    TableSaleItems
} from './components'

import { BasePageLayout } from '../../shared/layouts'
import { DetailTools } from '../../shared/components'

import { useAuthContext } from '../../shared/contexts'

import {
    VTextField,
    VForm,
    useVForm,
} from '../../shared/forms'

//Hooks personalizados
import {
    UseFetchSaleData,
    UseHandleSale
} from './hooks/detailsHooks'

export const SaleDetails: React.FC = () => {
    const { accessLevel } = useAuthContext()

    const { idSale = '', idCustomer = '' } = useParams<'idSale' | 'idCustomer'>()

    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const [saleStatus, setSaleStatus] = useState<TSaleStatus>('' as TSaleStatus)

    const [salesItems, setSaleItems] = useState<ISaleItemsList[]>([])
    const [saleAddress, setSaleAddress] = useState<IListAddress>({} as IListAddress)
    const [saleCustomer, setSaleCustomer] = useState<IListCustomer>({} as IListCustomer)

    const [trackingCode, setTrackingCode] = useState<undefined | string>(undefined)

    //Hooks personalizados
    UseFetchSaleData({
        setIsLoading,
        setSaleItems,
        setSaleAddress,
        setSaleStatus,
        setName,
        setSaleCustomer,
        setTrackingCode,
        formRef,
        idSale,
        idCustomer
    })

    const { 
        handleUpdateTrackingCode, 
        handleConcludeSale, 
        handleDeleteSale 
    } = UseHandleSale({ idSale, idCustomer, formRef, setSaleStatus, setIsLoading })

    return (
        <BasePageLayout
            title={`'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton={!(saleStatus === 'Ag. Pagamento' || saleStatus === 'Em preparação')}
                    showNewButton={false}
                    showDeleteButton={(accessLevel === 'Root')}

                    onClickSaveButton={() => formRef.current?.submitForm()}
                    onClickDeleteButton={() => handleDeleteSale()}
                    onClickBackButton={() => navigate(-1)}
                />
            }>
            
            <VForm ref={formRef} onSubmit={handleUpdateTrackingCode}>
                <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

                    <Grid container direction='column' padding={2} spacing={2}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant='h6'>Detalhes do Pedido</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Status 🚫' name='status' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data do pedido 🚫' name='order_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Previsão de entrega 🚫' name='estimated_delivery_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Vencimento 🚫' name='payment_due_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Forma de pagamento 🚫' name='payment_method' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Forma de envio 🚫' name='shipping_method' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data de recebimento 🚫' name='payment_received_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data de entrega 🚫' name='delivery_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField 
                                    fullWidth 
                                    label={`Código de rastreio ${(saleStatus === 'Ag. Pagamento' || saleStatus === 'Em preparação' || saleStatus === 'Cancelada') ? '🚫' : ''}`} 
                                    name='tracking_code' 
                                    InputProps={{ readOnly: (saleStatus === 'Ag. Pagamento' || saleStatus === 'Em preparação' || saleStatus === 'Cancelada') }} 
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Valor do frete 🚫' name='shipping_cost' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Subtotal 🚫' name='subtotal' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Total 🚫' name='total' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            </VForm>

            <TableSaleItems
                isLoading={isLoading}
                salesItemsList={salesItems} 
            />

            <SaleInfoSection
                isLoading={isLoading}
                idSale={Number(idSale)}
                idCustomer={Number(idCustomer)}
                saleAddress={saleAddress}
                saleCustomer={saleCustomer}
                saleStatus={saleStatus}
                formRef={formRef}
                trackingCode={trackingCode}
                setSaleStatus={setSaleStatus}
                handleConcludeSale={handleConcludeSale}
                setSaleAddress={setSaleAddress}
                setTrackingCode={setTrackingCode}
            />
        </BasePageLayout>
    )
}