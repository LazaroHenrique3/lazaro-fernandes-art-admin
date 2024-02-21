import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Box,
    Button,
    Grid,
    Icon,
    IconButton,
    LinearProgress,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'

import { BasePageLayout } from '../../shared/layouts'
import { ISaleListAll } from '../../shared/services/api/sales/SaleService'
import { ListTools } from '../../shared/components'

import { Environment } from '../../shared/environment'

import {
    StyledTableCellStatus,
    StyledTableCell,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

import { formattedDateBR, formattedDateUS, formattedPrice } from '../../shared/util'

//Hooks personalizados
import {
    UseFetchSaleData,
    UseHandleSale
} from './hooks/listHooks'

import { VDateInput, VForm, VSelect, useVForm } from '../../shared/forms'

interface IFilterData {
    status: string,
    orderDate: Date,
    paymentDueDate: Date,
    orderByPrice: string
}

export const SaleList = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const { formRef } = useVForm('formRef')

    const [rows, setRows] = useState<ISaleListAll[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    //Fazer a pesquisa do input de pesquisa através da URL
    //Toda vez que for digitado um texto será mudado o searchParams da Url
    //Logo o valor vai ser modificado, o que por sua vez executa o useMemo
    //E por fim esse valor será armazenado em 'search'

    const search = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('search') || ''
    }, [searchParams])

    const page = useMemo(() => {
        //Pega o parâmetro na URL
        return Number(searchParams.get('page') || '1')
    }, [searchParams])

    const status = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('status') || ''
    }, [searchParams])

    const orderDate = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('orderDate') || ''
    }, [searchParams])

    const paymentDueDate = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('paymentDueDate') || ''
    }, [searchParams])

    const orderByPrice = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('orderByPrice') || ''
    }, [searchParams])

    //Hooks personalizados
    UseFetchSaleData({ setIsLoading, setRows, setTotalCount, page, search, status, orderDate, paymentDueDate, orderByPrice })

    const { handleCancelSale, handlePDF } = UseHandleSale({ setRows, rows, search, status, orderDate, paymentDueDate, orderByPrice })

    const handleSearchFilters = (data: IFilterData) => {
        setSearchParams({
            search: search,
            page: '1',
            status: data.status,
            orderDate: formattedDateUS(data.orderDate),
            paymentDueDate: formattedDateUS(data.paymentDueDate),
            orderByPrice: data.orderByPrice
        },
        { replace: true })
    }

    const handlePagination = (page: string) => {
        setSearchParams({
            search: search,
            page: page,
            status: status,
            orderDate: orderDate,
            paymentDueDate: paymentDueDate,
            orderByPrice: orderByPrice
        },
        { replace: true })
    }

    const handleSearch = (newSearch: string) => {
        setSearchParams({
            search: newSearch,
            page: '1',
            status: status,
            orderDate: orderDate,
            paymentDueDate: paymentDueDate,
            orderByPrice: orderByPrice
        },
        { replace: true })
    }

    const handleResetFilters = () => {
        setSearchParams({
            search: search,
            page: '1',
            status: '',
            orderDate: '',
            paymentDueDate: '',
            orderByPrice: ''
        },
        { replace: true })

        formRef.current?.reset()
        formRef.current?.setData({
            status: '',
            orderByPrice: ''
        })
    }

    return (
        <BasePageLayout
            title={'Vendas'}
            toolBar={
                <ListTools
                    showSearchInput
                    showNewButton={false}
                    searchText={search}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => handleSearch(text)}
                />
            }>

            <VForm ref={formRef} onSubmit={handleSearchFilters}>
                <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

                    <Grid container direction='column' padding={2} spacing={2}>
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid item>
                            <Typography variant='h6'>Filtros</Typography>
                        </Grid>

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Status'
                                    name='status'
                                    options={[
                                        { value: 'Ag. Pagamento', label: 'Ag. Pagamento' },
                                        { value: 'Em preparação', label: 'Em preparação' },
                                        { value: 'Enviado', label: 'Enviado' },
                                        { value: 'Concluída', label: 'Concluída' },
                                        { value: 'Cancelada', label: 'Cancelada' }
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VDateInput label='Data do pedido' name='orderDate' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VDateInput label='Data de vencimento' name='paymentDueDate' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Total'
                                    name='orderByPrice'
                                    options={[
                                        { value: 'DESC', label: 'Maior Valor' },
                                        { value: 'ASC', label: 'Menor Valor' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <Box display='flex' gap={2}>
                                    <Button variant='contained' type='submit' sx={{ marginTop: 1 }} disabled={isLoading}>
                                        <Icon>search</Icon>
                                    </Button>

                                    <Button variant='outlined' type='button' sx={{ marginTop: 1 }} onClick={handleResetFilters}>
                                        <Icon>refresh</Icon>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </VForm>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Ações</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>ID</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Cliente</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Data Pedido</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Data Vencimento</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Total do Pedido</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell size='small'>
                                    {(row.status !== 'Cancelada') &&
                                        <IconButton color='error' onClick={() => handleCancelSale(row.id, row.customer_id)}>
                                            <Icon>cancel</Icon>
                                        </IconButton>
                                    }

                                    <IconButton color='primary' onClick={() => navigate(`/admin/sale/details/${row.id}/${row.customer_id}`)}>
                                        <Icon>visibility</Icon>
                                    </IconButton>
                                </StyledTableCell>

                                <StyledTableCell size='small'>{`#${row.id}`}</StyledTableCell>
                                <StyledTableCellStatus size='small' status={row.status} />
                                <StyledTableCell size='small'>{row.customer_name}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedDateBR(row.order_date)}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedDateBR(row.payment_due_date)}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedPrice(row.total + row.shipping_cost)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.EMPTY_LISTING}</caption>
                    )}
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={7}>
                                    <LinearProgress variant='indeterminate' />
                                </StyledTableCell>
                            </TableRow>
                        )}

                        {(totalCount > 0 && totalCount > Environment.LINE_LIMIT) && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={7}>
                                    <Pagination
                                        page={page}
                                        count={Math.ceil(totalCount / Environment.LINE_LIMIT)}
                                        onChange={(e, newPage) => handlePagination(newPage.toString())}
                                    />
                                </StyledTableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>

        </BasePageLayout>
    )
}