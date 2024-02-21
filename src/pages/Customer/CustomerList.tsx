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

import { IListCustomer } from '../../shared/services/api/customer/CustomerService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'

import {
    StyledTableCell,
    StyledTableCellStatus,
    StyledTableRow
} from '../../shared/components/StyledComponents/TableComponents'

import {
    formatCPF,
    formatPhoneNumber,
    formattedDateBR,
    formattedDateUS
} from '../../shared/util'

//Hooks personalizados
import {
    UseFetchCustomerData,
    UseHandleCustomer
} from './hooks/listHooks'
import { VDateInput, VForm, VSelect, useVForm } from '../../shared/forms'

interface IFilterData {
    status: string,
    genre: string,
    dateOfBirth: Date
}

export const CustomerList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const { formRef } = useVForm('formRef')

    const [rows, setRows] = useState<IListCustomer[]>([])
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

    const genre = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('genre') || ''
    }, [searchParams])

    const dateOfBirth = useMemo(() => {
        //Pega o parâmetro na URL
        return searchParams.get('dateOfBirth') || ''
    }, [searchParams])

    //Hooks personalizados
    UseFetchCustomerData({ setIsLoading, setRows, setTotalCount, search, page, status, genre, dateOfBirth })

    const { handleDelete, handlePDF } = UseHandleCustomer({ setRows, rows, search, status, genre, dateOfBirth })

    const handleSearchFilters = (data: IFilterData) => {
        setSearchParams({
            search: search,
            page: '1',
            status: data.status,
            genre: data.genre,
            dateOfBirth: formattedDateUS(data.dateOfBirth),
        },
        { replace: true })
    }

    const handlePagination = (page: string) => {
        setSearchParams({
            search: search,
            page: page,
            status: status,
            genre: genre,
            dateOfBirth: dateOfBirth,
        },
        { replace: true })
    }

    const handleSearch = (newSearch: string) => {
        setSearchParams({
            search: newSearch,
            page: '1',
            status: status,
            genre: genre,
            dateOfBirth: dateOfBirth,
        },
        { replace: true })
    }

    const handleResetFilters = () => {
        setSearchParams({
            search: search,
            page: '1',
            status: '',
            genre: '',
            dateOfBirth: '',
        },
        { replace: true })

        formRef.current?.reset()
        formRef.current?.setData({
            status: '',
            genre: ''
        })
    }

    return (
        <BasePageLayout
            title="Clientes"
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
                                        { value: 'Ativo', label: 'Ativo' },
                                        { value: 'Inativo', label: 'Inativo' }
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Gênero'
                                    name='genre'
                                    options={[
                                        { value: 'M', label: 'Masculino' },
                                        { value: 'F', label: 'Feminino' },
                                        { value: 'L', label: 'LGBTQIAPN+' },
                                        { value: 'N', label: 'Não informado' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VDateInput label='Data de nascimento' name='dateOfBirth' disabled={isLoading} />
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
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Status</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Nome</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Email</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Telefone</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Gênero</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Nascimento</StyledTableCell>
                            <StyledTableCell size='small' sx={{ fontWeight: 600 }}>CPF</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell size='small'>
                                    <IconButton color='error' onClick={() => handleDelete(row.id, row.name)}>
                                        <Icon>delete</Icon>
                                    </IconButton>

                                    <IconButton color='primary' onClick={() => navigate(`/admin/customer/details/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCellStatus size='small' status={row.status} />
                                <StyledTableCell size='small'>{row.name}</StyledTableCell>
                                <StyledTableCell size='small'>{row.email}</StyledTableCell>
                                <StyledTableCell size='small'>{formatPhoneNumber(row.cell_phone)}</StyledTableCell>
                                <StyledTableCell size='small'>{row.genre}</StyledTableCell>
                                <StyledTableCell size='small'>{formattedDateBR(row.date_of_birth)}</StyledTableCell>
                                <StyledTableCell size='small'>{formatCPF(row.cpf)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.EMPTY_LISTING}</caption>
                    )}
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <StyledTableCell size='small' colSpan={8}>
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
                                        onChange={(e, newPage) => handlePagination(newPage.toString())}
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