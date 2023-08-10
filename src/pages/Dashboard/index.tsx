import { useState } from 'react'
import { Box, Button, ButtonGroup, Card, CardContent, Grid, Typography, Icon } from '@mui/material'

import { DonutChart, LineChart } from '../../shared/components'
import { BasePageLayout } from '../../shared/layouts'

export const Dashboard = () => {

    const [typeInfoDashboard, setTypeInfoDashboard] = useState('financial')

    return (
        <BasePageLayout title='Página inicial'>

            <Box marginX={2}>
                <ButtonGroup variant='contained' >
                    <Button onClick={() => {setTypeInfoDashboard('financial')}}>Financeiro</Button>
                    <Button onClick={() => {setTypeInfoDashboard('shipping')}}>Envios</Button>
                </ButtonGroup>
            </Box>

            <Box width='100%' overflow='hidden' display='flex' flexDirection='column'>
                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant='h5' align='center'>
                                        Faturamento(Mês Passado):
                                    </Typography>

                                    <Box padding={2} display='flex' justifyContent='center' alignItems='center'>
                                        <Typography variant='h4'>
                                            R$: 2.000,00
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant='h5' align='center'>
                                        Faturamento(Mês Atual):
                                    </Typography>

                                    <Box padding={2} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                        <Typography variant='h4'>
                                            R$: 1.500,00
                                        </Typography>

                                        <Box color='red' display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                            <Icon>
                                                keyboard_double_arrow_down_ico
                                            </Icon>

                                            <Typography variant='h6'>
                                                ( R$: -500,00)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container margin={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <LineChart />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                <CardContent>
                                    <DonutChart />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

        </BasePageLayout >
    )
}