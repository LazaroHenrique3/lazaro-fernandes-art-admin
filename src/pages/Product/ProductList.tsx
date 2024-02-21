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

import { IListProduct } from '../../shared/services/api/product/ProductService'
import { BasePageLayout } from '../../shared/layouts'
import { ListTools } from '../../shared/components'
import { Environment } from '../../shared/environment'
import {
    formattedDateBR,
    formattedDateUS,
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
import { VDateInput, VForm, VSelect, useVForm } from '../../shared/forms'
import { VAutoCompleteCategory } from './components/VAutoCompleteCategory'
import { VAutoCompleteTechnique } from './components/VAutoCompleteTechnique'
import { VAutoCompleteDimension } from './components/VAutoCompleteDimension'

interface IFilterData {
    status: string,
    type: string,
    orientation: string,
    category_id: string,
    technique_id: string,
    dimension_id: string,
    productionDate: Date,
    orderByPrice: string
}

export const ProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const { formRef } = useVForm('formRef')

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

    const status = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('status') || '')
    }, [searchParams])

    const type = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('type') || '')
    }, [searchParams])

    const orientation = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('orientation') || '')
    }, [searchParams])

    const category = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('category') || '')
    }, [searchParams])

    const technique = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('technique') || '')
    }, [searchParams])

    const dimension = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('dimension') || '')
    }, [searchParams])

    const productionDate = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('productionDate') || '')
    }, [searchParams])

    const orderByPrice = useMemo(() => {
        //Pega o parâmetro na URL
        return (searchParams.get('orderByPrice') || '')
    }, [searchParams])

    //Hooks personalizados
    UseFetchProductData({
        setIsLoading,
        setRows,
        setTotalCount,
        search,
        page,
        status,
        type,
        orientation,
        category,
        technique,
        dimension,
        productionDate,
        orderByPrice
    })

    const { handleDelete, handlePDF } = UseHandleProduct({ 
        setRows, 
        rows, 
        search,
        status,
        type,
        orientation,
        category,
        technique,
        dimension,
        productionDate,
        orderByPrice
    })

    const handleSearchFilters = (data: IFilterData) => {
        setSearchParams({
            search: search,
            page: '1',
            status: data.status,
            type: data.type,
            orientation: data.orientation,
            category: data.category_id,
            technique: data.technique_id,
            dimension: data.dimension_id,
            productionDate: formattedDateUS(data.productionDate),
            orderByPrice: data.orderByPrice
        },
        { replace: true })
    }

    const handlePagination = (page: string) => {
        setSearchParams({
            search: search,
            page: page,
            status: status,
            type: type,
            orientation: orientation,
            category: category,
            technique: technique,
            dimension: dimension,
            productionDate: productionDate,
            orderByPrice: orderByPrice
        },
        { replace: true })
    }

    const handleSearch = (newSearch: string) => {
        setSearchParams({
            search: newSearch,
            page: '1',
            status: status,
            type: type,
            orientation: orientation,
            category: category,
            technique: technique,
            dimension: dimension,
            productionDate: productionDate,
            orderByPrice: orderByPrice
        },
        { replace: true })
    }

    const handleResetFilters = () => {
        setSearchParams({
            search: search,
            page: '1',
            status: '',
            type: '',
            orientation: '',
            category: '',
            technique: '',
            dimension: '',
            productionDate: '',
            orderByPrice: ''
        },
        { replace: true })

        formRef.current?.reset()
        formRef.current?.setData({
            status: '',
            type: '',
            orientation: '',
            orderByPrice: ''
        })
    }

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
                                        { value: 'Vendido', label: 'Vendido' },
                                        { value: 'Inativo', label: 'Inativo' }
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Tipo'
                                    name='type'
                                    options={[
                                        { value: 'Original', label: 'Original' },
                                        { value: 'Print', label: 'Print' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Orientação'
                                    name='orientation'
                                    options={[
                                        { value: 'Retrato', label: 'Retrato' },
                                        { value: 'Paisagem', label: 'Paisagem' },
                                    ]}
                                    disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VAutoCompleteCategory isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VAutoCompleteTechnique isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VAutoCompleteDimension isExternalLoading={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VDateInput label='Data do produção' name='productionDate' disabled={isLoading} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                                <VSelect
                                    fullWidth
                                    label='Preço'
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