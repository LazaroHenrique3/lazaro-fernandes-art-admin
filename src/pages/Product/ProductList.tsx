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

import { IListProduct } from '../../shared/services/api/product/ProductService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'
import {
    formattedDateBR,
    formattedPrice
} from '../../shared/util'

import {
    StyledTableCell,
    StyledTableCellStatus,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

//Hooks personalizados
import {
    UseFetchProductData,
    UseHandleProduct
} from './hooks/listHooks'

export const ProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [rows, setRows] = useState<IListProduct[]>([])
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
    UseFetchProductData({ setIsLoading, setRows, setTotalCount, search, page })

    const { handleDelete, handlePDF } = UseHandleProduct({ setRows, rows, search })

    return (
        <BasePageLayout
            title="Produtos"
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Novo'
                    searchText={search}
                    onClickNewButton={() => navigate('/admin/product/details/new')}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Ações</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Tipo</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Título</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Orientação</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Categoria</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Técnica</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Dimensão</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Produção</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Qtd.</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Peso(g)</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Preço</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell size='small'>
                                    {/* Se estiver como vendido eu nem quero msotrar a opção de exclusão */}
                                    {(row.status !== 'Vendido') && (
                                        <IconButton color='error' onClick={() => handleDelete(row.id, row.title)}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    )}

                                    <IconButton color='primary' onClick={() => navigate(`/admin/product/details/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCellStatus size='small' status={row.status} />
                                <StyledTableCell size='small'>{row.type}</StyledTableCell>
                                <StyledTableCell size='small'>{row.title}</StyledTableCell>
                                <StyledTableCell size='small'>{row.orientation}</StyledTableCell>
                                <StyledTableCell size='small'>{row.category_name}</StyledTableCell>
                                <StyledTableCell size='small'>{row.technique_name}</StyledTableCell>
                                <StyledTableCell size='small'>{row.dimension_name}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedDateBR(row.production_date)}</StyledTableCell>
                                <StyledTableCell size='small'>{row.quantity}</StyledTableCell>
                                <StyledTableCell size='small'>{row.weight}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedPrice(row.price ?? '')}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.EMPTY_LISTING}</caption>
                    )}
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={11}>
                                    <LinearProgress variant='indeterminate' />
                                </StyledTableCell>
                            </TableRow>
                        )}

                        {(totalCount > 0 && totalCount > Environment.LINE_LIMIT) && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={11}>
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
        </BasePageLayout >
    )
}