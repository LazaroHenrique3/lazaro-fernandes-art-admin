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

import { IListAdministrator } from '../../shared/services/api/administrator/AdministratorService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'

import { useAuthContext } from '../../shared/contexts'

import {
    StyledTableCell,
    StyledTableCellStatus,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

//Hooks personalizados
import {
    UseFetchAdministratorData,
    UseHandleAdministrator
} from './hooks/listHooks'

export const AdministratorList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [rows, setRows] = useState<IListAdministrator[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    //Descobrindo o nível de acesso do usuaário logado
    const { accessLevel } = useAuthContext()

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
    UseFetchAdministratorData({ setIsLoading, setRows, setTotalCount, search, page })

    const { handleDelete, handlePDF } = UseHandleAdministrator({ setRows, rows, search })

    return (
        <BasePageLayout
            title="Administradores"
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Novo'
                    searchText={search}
                    onClickNewButton={() => navigate('/admin/administrator/details/new')}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
                <Table>
                    <TableHead>
                        <TableRow>
                            {(accessLevel !== undefined && accessLevel === 'Root') && (
                                <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Ações</StyledTableCell>
                            )}
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Nome</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Email</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                {(accessLevel !== undefined && accessLevel === 'Root') && (
                                    <StyledTableCell size='small'>
                                        <IconButton color='error' onClick={() => handleDelete(row.id, row.name)}>
                                            <Icon>delete</Icon>
                                        </IconButton>

                                        <IconButton color='primary' onClick={() => navigate(`/admin/administrator/details/${row.id}`)}>
                                            <Icon>edit</Icon>
                                        </IconButton>
                                    </StyledTableCell>

                                )}
                                <StyledTableCellStatus size='small' status={row.status} />
                                <StyledTableCell size='small'>{row.name}</StyledTableCell>
                                <StyledTableCell size='small'>{row.email}</StyledTableCell>
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