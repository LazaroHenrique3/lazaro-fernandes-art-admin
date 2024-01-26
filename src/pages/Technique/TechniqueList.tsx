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

import { IListTechnique } from '../../shared/services/api/technique/TechniqueService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'

import { StyledTableCell, StyledTableCellStatus, StyledTableRow } from '../../shared/components/StyledComponents/TableComponents'

//Hooks personalizados
import {
    UseFetchTechniqueData,
    UseHandleTechnique
} from './hooks/listHooks'
import { VForm, VSelect, useVForm } from '../../shared/forms'

interface IFilterData {
    status: string,
}

export const TechniqueList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const { formRef } = useVForm('formRef')

    const [rows, setRows] = useState<IListTechnique[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    //Para adicionar delay na pesquisa
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

    //Hooks personalizados
    UseFetchTechniqueData({ setIsLoading, setRows, setTotalCount, search, page, status })

    const { handleDelete, handlePDF } = UseHandleTechnique({ setRows, rows, search, status })

    const handleSearchFilters = (data: IFilterData) => {
        setSearchParams({
            search: search,
            page: '1',
            status: data.status,
        },
        { replace: true })
    }

    const handleResetFilters = () => {
        setSearchParams({
            search: search,
            page: '1',
            status: '',
        },
        { replace: true })

        formRef.current?.reset()
        formRef.current?.setData({
            status: '',
        })
    }

    return (
        <BasePageLayout
            title="Técnicas"
            toolBar={
                <ListTools
                    showSearchInput
                    newButtonText='Nova'
                    searchText={search}
                    onClickNewButton={() => navigate('/admin/technique/details/new')}
                    onClickPDFButton={() => handlePDF()}
                    onChangeSearchText={text => setSearchParams({ search: text, page: '1' }, { replace: true })}
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
                                        { value: 'Ativo', label: 'Ativo' },
                                        { value: 'Inativo', label: 'Inativo' },
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
                            <StyledTableCell width={100} size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Nome</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell size='small'>
                                    <IconButton color='error' onClick={() => handleDelete(row.id, row.name)}>
                                        <Icon>delete</Icon>
                                    </IconButton>

                                    <IconButton color='primary' onClick={() => navigate(`/admin/technique/details/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCellStatus size='small' status={row.status} />
                                <StyledTableCell size='small'>{row.name}</StyledTableCell>
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