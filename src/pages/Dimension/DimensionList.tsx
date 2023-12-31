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

import { IListDimension } from '../../shared/services/api/dimension/DimensionService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'

import { StyledTableCell, StyledTableCellStatus, StyledTableRow } from '../../shared/components/StyledComponents/TableComponents'

//Hooks personalizados
import {
    UseFetchDimensionData,
    UseHandleDimension
} from './hooks/listHooks'

export const DimensionList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [rows, setRows] = useState<IListDimension[]>([])
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

    UseFetchDimensionData({ setIsLoading, setRows, setTotalCount, search, page })

    const { handleDelete, handlePDF } = UseHandleDimension({ setRows, rows, search })

    return (
        <BasePageLayout
            title="Dimensões"
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Nova'
                    searchText={search}
                    onClickNewButton={() => navigate('/admin/dimension/details/new')}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Ações</StyledTableCell>
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Nome</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id} >
                                <StyledTableCell size='small'>
                                    <IconButton color='error' onClick={() => handleDelete(row.id, row.dimension)}>
                                        <Icon>delete</Icon>
                                    </IconButton>

                                    <IconButton color='primary' onClick={() => navigate(`/admin/dimension/details/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCellStatus size='small' status={row.status}/>
                                <StyledTableCell size='small'>{row.dimension}</StyledTableCell>
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
                                <StyledTableCell size='small' colSpan={3}>
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