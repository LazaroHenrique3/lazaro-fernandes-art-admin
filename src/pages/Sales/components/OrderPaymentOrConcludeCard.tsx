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
    TSalePaymentMethods,
    TSaleStatus
} from '../../../shared/services/api/sales/SaleService'

interface IPaymentSelectCardProps {
    saleStatus: TSaleStatus
    paymentMethod: TSalePaymentMethods
    handleConcludeOrder: () => void
}

export const OrderPaymentOrConcludeCard: React.FC<IPaymentSelectCardProps> = ({
    paymentMethod,
    saleStatus,
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

                            {saleStatus === 'Ag. Pagamento' && paymentMethod}
                        </Box>

                        {(saleStatus === 'Enviado') && (
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