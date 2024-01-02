import { useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Icon,
    FormGroup,
    FormControlLabel,
    Switch,
    Skeleton,
} from '@mui/material'

import { formattedPrice } from '../../shared/util'
import { BasePageLayout } from '../../shared/layouts'

import {
    IFinancialInformations
} from '../../shared/services/api/sales/SaleService'

import {
    CategoriesChart,
} from '../../shared/components'

//Hooks personalizados
import {
    UseFetchFinancialData
} from './hooks/UseFetchFinancialData'
import { ColorDotStatus } from '../../shared/components/StyledComponents/TableComponents'

export const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [financialData, setFinancialData] = useState<IFinancialInformations>({} as IFinancialInformations)

    const [isTotalRevenue, setIsTotalRevenue] = useState(false)

    UseFetchFinancialData({ setIsLoading, setFinancialData })

    const isNegativeBalance = financialData.currentMonthBilling < financialData.lastMonthBilling

    return (
        <BasePageLayout title='Página inicial'>

            <Box width='100%' overflow='hidden' display='flex' flexDirection='column'>
                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <Card sx={{ height: '100%' }}>
                                {(isLoading) ? (
                                    <Skeleton variant="rectangular" width={450} height={200} />
                                ) : (
                                    <CardContent>
                                        <Typography variant='h5' align='center'>
                                            Faturamento({(isTotalRevenue) ? 'Total' : 'Mês Passado'}):
                                        </Typography>

                                        <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                            <Typography variant='h4'>
                                                {(isTotalRevenue) ? formattedPrice(financialData.totalRevenue) : formattedPrice(financialData.lastMonthBilling)}
                                            </Typography>
                                        </Box>

                                        <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                            <FormGroup>
                                                <FormControlLabel control={<Switch onClick={() => setIsTotalRevenue(!isTotalRevenue)} />} label="Total" />
                                            </FormGroup>
                                        </Box>
                                    </CardContent>
                                )}
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <Card sx={{ height: '100%' }}>
                                {(isLoading) ? (
                                    <Skeleton variant="rectangular" width={450} height={200} />
                                ) : (
                                    <CardContent>
                                        <Typography variant='h5' align='center'>
                                            Faturamento(Mês Atual):
                                        </Typography>

                                        <Box padding={2} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                            <Typography variant='h4'>
                                                {formattedPrice(financialData.currentMonthBilling)}
                                            </Typography>

                                            <Box
                                                color={isNegativeBalance ? 'red' : 'green'}
                                                display='flex'
                                                flexDirection='row'
                                                justifyContent='center'
                                                alignItems='center'>

                                                <Icon>
                                                    {isNegativeBalance ? 'keyboard_double_arrow_down_ico' : 'keyboard_double_arrow_up_ico'}
                                                </Icon>

                                                <Typography
                                                    variant='h6'
                                                    color={isNegativeBalance ? 'red' : 'green'}>
                                                    {(formattedPrice(financialData.currentMonthBilling - financialData.lastMonthBilling))}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant='h6' display="flex" alignItems="center">
                                                    <ColorDotStatus status='Em preparação' />
                                                    Pedidos Ag. Preparação: {financialData.totalSaleInPreparation}
                                                </Typography>

                                                <Typography variant='h6' display="flex" alignItems="center">
                                                    <ColorDotStatus status='Ag. Pagamento' />
                                                    Pedidos Ag.Pagamento: {financialData.totalSaleAwaitingPayment}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container margin={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                {(isLoading) ? (
                                    <Skeleton variant="rectangular" width={700} height={400} />
                                ) : (financialData.topCategories.length > 0) ? (
                                    <CardContent>
                                        <CategoriesChart dataChart={financialData.topCategories} />
                                    </CardContent>
                                ) : (<></>)}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </BasePageLayout >
    )
}