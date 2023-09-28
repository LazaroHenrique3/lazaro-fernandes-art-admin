import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
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
    TableRow
} from '@mui/material'

import { BasePageLayout } from '../../shared/layouts'
import { ISaleListAll } from '../../shared/services/api/sales/SaleService'
import { ListTools } from '../../shared/components'

import { Environment } from '../../shared/environment'

import { 
    StyledTableCell,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

import { formattedDateBR, formattedPrice } from '../../shared/util'

//Hooks personalizados
import {
    UseFetchSaleData,
    UseHandleSale
} from './hooks/listHooks'

export const SaleList = () => {
    const [searchParams, setSearchParams] = useSearchParams()

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

    //Hooks personalizados
    UseFetchSaleData({ setIsLoading, setRows, setTotalCount, page, search })

    const { handleCancelSale, handlePDF } = UseHandleSale({ setRows, rows, search })

    return (
        <BasePageLayout
            title={'Vendas'}
            toolBar={
                <ListTools
                    showSearchInput
                    showNewButton={false}
                    searchText={search}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
                />
            }>

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
                                    {(row.status === 'Ag. Pagamento' || row.status === 'Em preparação' ) &&
                                        <IconButton color='error' onClick={() => handleCancelSale(row.id, row.customer_id)}>
                                            <Icon>cancel</Icon>
                                        </IconButton>
                                    }

                                    <IconButton color='primary' onClick={() => navigate(`/admin/sale/details/${row.id}/${row.customer_id}`)}>
                                        <Icon>visibility</Icon>
                                    </IconButton>
                                </StyledTableCell>

                                <StyledTableCell size='small'>{`#${row.id}`}</StyledTableCell>
                                <StyledTableCell size='small'>{row.status}</StyledTableCell>
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
                                        onChange={(e, newPage) => setSearchParams({ page: newPage.toString() }, { replace: true })}
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