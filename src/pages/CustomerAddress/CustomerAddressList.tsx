import { useMemo, useState } from 'react'
import {
    useNavigate,
    useSearchParams,
    useParams
} from 'react-router-dom'

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
import { IListAddress } from '../../shared/services/api/address/AddressService'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'

import {
    StyledTableCell,
    StyledTableRow
} from '../.././shared/components/StyledComponents/TableComponents'
import { formatCEP } from '../../shared/util'

//Hooks personalizados
import {
    UseFetchAddressData,
    UseHandleAddress
} from './hooks/listHooks'

export const CustomerAddressList = () => {
    const { idCustomer = '0', nameCustomer = '' } = useParams<'idCustomer' | 'nameCustomer'>()

    const [searchParams, setSearchParams] = useSearchParams()

    const [rows, setRows] = useState<IListAddress[]>([])
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
    UseFetchAddressData({ setIsLoading, setRows, setTotalCount, search, page, idCustomer })

    const { handleDelete } = UseHandleAddress({ setRows, rows, search, idCustomer })

    return (
        <BasePageLayout
            title={`Endereços - (${nameCustomer})`}
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Novo'
                    showPDFButton={false}
                    showBackButton={true}
                    searchText={search}
                    onClickNewButton={() => navigate(`/admin/customer/customer-address/details/${idCustomer}/new/${nameCustomer}`)}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
                    onClickBackButton={() => navigate(`/admin/customer/details/${idCustomer}`)}
                />
            }>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Ações</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Cidade</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Estado</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Número</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>CEP</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Complemento</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Bairro</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Logradouro</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell size='small'>
                                    <IconButton color='error' onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>

                                    <IconButton color='primary' onClick={() => navigate(`/admin/customer/customer-address/details/${idCustomer}/${row.id}/${nameCustomer}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell size='small'>{row.city}</StyledTableCell>
                                <StyledTableCell size='small'>{row.state}</StyledTableCell>
                                <StyledTableCell size='small'>{row.number}</StyledTableCell>
                                <StyledTableCell size='small'>{formatCEP(row.cep)}</StyledTableCell>
                                <StyledTableCell size='small'>{row?.complement}</StyledTableCell>
                                <StyledTableCell size='small'>{row.neighborhood}</StyledTableCell>
                                <StyledTableCell size='small'>{row.street}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.EMPTY_LISTING}</caption>
                    )}
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={3}>
                                    <LinearProgress variant='indeterminate' />
                                </StyledTableCell>
                            </TableRow>
                        )}

                        {(totalCount > 0 && totalCount > Environment.LINE_LIMIT) && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={8}>
                                    <Pagination
                                        page={page}
                                        count={Math.ceil(totalCount / Environment.LINE_LIMIT)}
                                        onChange={(e, newPage) => setSearchParams({ search, page: newPage.toString() }, { replace: true })}
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