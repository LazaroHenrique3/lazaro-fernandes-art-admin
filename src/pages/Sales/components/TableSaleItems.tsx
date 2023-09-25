import {
    LinearProgress,
    Paper,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material'

import { 
    StyledTableRow,
    StyledTableCell 
} from '../../../shared/components/StyledComponents/TableComponents'

import { formattedPrice } from '../../../shared/util'
import { ISaleItemsList } from '../../../shared/services/api/sales/SaleService'

interface ITableSaleItems {
    isLoading: boolean
    salesItemsList: ISaleItemsList[]
}

export const TableSaleItems: React.FC<ITableSaleItems> = ({ salesItemsList, isLoading }) => {

    return (
        <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }} >
            <Typography variant='h6'>Items do pedido</Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>ID</StyledTableCell>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Produto</StyledTableCell>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Quantidade</StyledTableCell>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Preço</StyledTableCell>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Desconto</StyledTableCell>
                        <StyledTableCell size='small' sx={{ fontWeight: 600 }}>Total</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {salesItemsList.map((item) => (
                        <StyledTableRow key={item.product_id}>
                            <StyledTableCell size='small'>{`#${item.product_id}`}</StyledTableCell>
                            <StyledTableCell size='small'>{item.product_title}</StyledTableCell>
                            <StyledTableCell size='small'>{item.quantity}</StyledTableCell>
                            <StyledTableCell size='small'>{formattedPrice(item.price)}</StyledTableCell>
                            <StyledTableCell size='small'>{formattedPrice(item.discount)}</StyledTableCell>
                            <StyledTableCell size='small'>{formattedPrice((item.price * item.quantity) - item.discount)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    {isLoading && (
                        <TableRow>
                            <StyledTableCell size='small' colSpan={3}>
                                <LinearProgress variant='indeterminate' />
                            </StyledTableCell>
                        </TableRow>
                    )}
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
