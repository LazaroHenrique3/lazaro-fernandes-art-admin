import { FormHandles } from '@unform/core'
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Icon,
    Box
} from '@mui/material'

import {
    SendSaleModal
} from '../../../../shared/components/Modals/SendSale/SendSale'

import {
    TSaleStatus
} from '../../../../shared/services/api/sales/SaleService'

interface IOrderSendOrConcludeCardProps {
    saleStatus: TSaleStatus
    idSale: number,
    idCustomerSale: number,
    updateSendStatus: (status: TSaleStatus) => void
    formRef: React.RefObject<FormHandles>
    handleConcludeOrder: () => void
}

export const OrderSendOrConcludeCard: React.FC<IOrderSendOrConcludeCardProps> = ({
    saleStatus,
    idSale,
    idCustomerSale,
    updateSendStatus,
    formRef,
    handleConcludeOrder
}) => {
    return (
        <Grid container item xs={12} sm={6} lg={4} xl={3} justifyContent='center'>
            <Card sx={{ width: 270 }}>
                <CardContent sx={{ height: '90%' }}>
                    <Box height='100%' display='flex' flexDirection='column' justifyContent='space-between' gap={3}>
                        <Box>
                            <Typography variant='h6' marginBottom={3}>
                                {saleStatus}
                            </Typography>
                        </Box>

                        {(saleStatus === 'Em preparação') ? (
                            <SendSaleModal
                                updateSendStatus={updateSendStatus}
                                externalFormSaleRef={formRef}
                                idSale={idSale}
                                idCustomer={idCustomerSale} />
                        ) : (
                            <Button
                                onClick={handleConcludeOrder}
                                variant='contained'
                                startIcon={<Icon>check_circle</Icon>}>
                                Pedido recebido
                            </Button>
                        )}

                    </Box>
                </CardContent>
            </Card>
        </Grid>
    )
}