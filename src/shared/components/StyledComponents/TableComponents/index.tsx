import {
    Box,
    TableCell,
    TableRow
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'

import { EnvironmentStatusColors } from '../../../environment'

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Estilo para o cabeçalho da tabela
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.primary.light,
        fontSize: 16,
    },
    // Estilo para as células do corpo da tabela
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    }
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // Estilo para as linhas ímpares
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // Estilo para o hover nas linhas
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
    // Esconder a última borda
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

interface ColorDotStatusProps {
    status: string; 
    size?: 'small'
}

const ColorDotStatus = styled('div')<ColorDotStatusProps>(({ theme, status }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    backgroundColor: EnvironmentStatusColors[status],
}))

export const StyledTableCellStatus: React.FC<ColorDotStatusProps> = ({ status, size }) => {
    return (
        <TableCell size={size}>
            <Box display="flex" alignItems="center">
                <ColorDotStatus status={status} />
                {status}
            </Box>
        </TableCell>
    )
}

