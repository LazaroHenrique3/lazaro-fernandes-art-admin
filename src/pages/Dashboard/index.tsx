import { useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Icon,
    Skeleton
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

export const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [financialData, setFinancialData] = useState<IFinancialInformations>({} as IFinancialInformations)

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
                                            Faturamento(Mês Passado):
                                        </Typography>

                                        <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                            <Typography variant='h4'>
                                                {formattedPrice(financialData.lastMonthBilling)}
                                            </Typography>
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
                                ) : (
                                    <CardContent>
                                        <CategoriesChart dataChart={financialData.topCategories}  />
                                    </CardContent>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </BasePageLayout >
    )
}