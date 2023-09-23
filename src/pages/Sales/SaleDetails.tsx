import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
    Box,
    Grid,
    LinearProgress,
    Paper,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Skeleton
} from '@mui/material'

import {
    StyledTableCell,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

import { formattedPrice } from '../../shared/util'

import {
    ISaleItemsList,
    TSalePaymentMethods,
    TSaleStatus
} from '../../shared/services/api/sales/SaleService'

import {
    IListAddress
} from '../../shared/services/api/address/AddressService'

import {
    IListCustomer
} from '../../shared/services/api/customer/CustomerService'

import {
    CustomerInfoCard,
    DeliveryAddressCard,
    OrderPaymentOrConcludeCard
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

    const { id = '', idUser = '' } = useParams<'id' | 'idUser'>()
    const navigate = useNavigate()

    const { formRef } = useVForm('formRef')

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const [paymentMethod, setPaymentMethod] = useState<TSalePaymentMethods>('' as TSalePaymentMethods)
    const [saleStatus, setSaleStatus] = useState<TSaleStatus>('' as TSaleStatus)

    const [salesItems, setSaleItems] = useState<ISaleItemsList[]>([])
    const [saleAddress, setSaleAddress] = useState<IListAddress>({} as IListAddress)
    const [saleCustomer, setSaleCustomer] = useState<IListCustomer>({} as IListCustomer)

    //Hooks personalizados
    UseFetchSaleData({
        setIsLoading,
        setSaleItems,
        setSaleAddress,
        setPaymentMethod,
        setSaleStatus,
        setName,
        setSaleCustomer,
        formRef,
        id,
        idUser
    })

    const { handleConcludeSale } = UseHandleSale({ formRef, setSaleStatus, setIsLoading })

    return (
        <BasePageLayout
            title={`'${name}'`}
            toolBar={
                <DetailTools
                    showSaveButton={false}
                    showNewButton={false}
                    showDeleteButton={(accessLevel === 'Root')}

                    onClickBackButton={() => navigate('/admin/sale')}
                />
            }>

            <VForm ref={formRef} onSubmit={() => console.log('')}>
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
                                <VTextField fullWidth label='Status' name='status' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data do pedido' name='order_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Previsão de entrega' name='estimated_delivery_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Vencimento' name='payment_due_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Forma de pagamento' name='payment_method' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Forma de envio' name='shipping_method' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data de recebimento' name='payment_received_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Data de entrega' name='delivery_date' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Código de rastreio' name='tracking_code' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Valor do frete' name='shipping_cost' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Subtotal' name='subtotal' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <VTextField fullWidth label='Total' name='total' InputProps={{ readOnly: true }} disabled={isLoading} />
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            </VForm>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Typography variant='h6'>Items do pedido</Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>ID</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Produto</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Quantidade</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Preço</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Desconto</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Total</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salesItems.map((item) => (
                            <StyledTableRow key={item.product_id}>
                                <StyledTableCell size='small'>{`#${item.product_id}`}</StyledTableCell>
                                <StyledTableCell size='small'>{item.product_title}</StyledTableCell>
                                <StyledTableCell size='small'>{item.quantity}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedPrice(item.price)}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedPrice(item.discount)}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedPrice((item.price * item.quantity) - item.discount)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={3}>
                                    <LinearProgress variant='indeterminate' />
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>

            <Grid container padding={2} spacing={2}>
                <Grid container item xl={12}>
                    <Typography variant='h6'>Informações do pedido</Typography>
                </Grid>

                {(isLoading || saleAddress.id === undefined) ? (
                    <>
                        <Grid container item xs={12} sm={6} lg={4} xl={3}>
                            <Skeleton variant="rectangular" width={300} height={200} />
                        </Grid>

                        <Grid container item xs={12} sm={6} lg={4} xl={3}>
                            <Skeleton variant="rectangular" width={300} height={200} />
                        </Grid>

                        <Grid container item xs={12} sm={6} lg={4} xl={3}>
                            <Skeleton variant="rectangular" width={300} height={200} />
                        </Grid>
                    </>
                ) : (
                    <>
                        <CustomerInfoCard
                            name={saleCustomer.name}
                            email={saleCustomer.email}
                            phoneNumber={saleCustomer.cell_phone}
                            cpf={saleCustomer.cpf}
                        />

                        <DeliveryAddressCard
                            cep={saleAddress.cep}
                            city={saleAddress.city}
                            state={saleAddress.state}
                            neighborhood={saleAddress.neighborhood}
                            number={String(saleAddress.number)}
                            street={saleAddress.street}
                            complement={saleAddress.complement}
                        />

                        {(saleStatus === 'Ag. Pagamento' || saleStatus === 'Enviado') &&
                            <OrderPaymentOrConcludeCard
                                handleConcludeOrder={() => handleConcludeSale(Number(id))}
                                paymentMethod={paymentMethod}
                                saleStatus={saleStatus}
                            />
                        }
                    </>
                )}

            </Grid>

        </BasePageLayout>
    )
}