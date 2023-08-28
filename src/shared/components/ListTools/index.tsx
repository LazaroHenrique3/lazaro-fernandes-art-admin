import { Box, Button, Paper, TextField, useTheme, Icon } from '@mui/material'

import { Environment } from '../../environment'

interface IListToolsProps {
    searchText?: string
    showSearchInput?: boolean
    onChangeSearchText?: (newText: string) => void
    newButtonText?: string
    showNewButton?: boolean
    showPDFButton?: boolean
    showBackButton?: boolean

    onClickNewButton?: () => void
    onClickPDFButton?: () => void
    onClickBackButton?: () => void
}

export const ListTools: React.FC<IListToolsProps> = ({
    searchText = '',
    showSearchInput = false,
    onChangeSearchText,
    newButtonText = 'Novo',
    showNewButton = true,
    showPDFButton = true,
    showBackButton = false,
    onClickNewButton,
    onClickPDFButton,
    onClickBackButton
}) => {

    const theme = useTheme()

    return (
        <Box marginX={1} padding={1} paddingX={2} display='flex' alignItems='center' gap={1} height={theme.spacing(5)} component={Paper}>
            {showSearchInput && (
                <TextField value={searchText} size='small' placeholder={Environment.SEARCH_INPUT} onChange={(e) => onChangeSearchText?.(e.target.value)} />
            )}

            <Box flex={1} display='flex' justifyContent='end' gap={1}>
                {showNewButton && (
                    <Box>
                        <Button color='primary' variant='contained' endIcon={<Icon>add</Icon>} onClick={onClickNewButton}>{newButtonText}</Button>
                    </Box>
                )}

                {showPDFButton && (
                    <Box>
                        <Button color='primary' variant='outlined' endIcon={<Icon>picture_as_pdf</Icon>} onClick={onClickPDFButton}>PDF</Button>
                    </Box>
                )}

                {showBackButton && (
                    <Box>
                        <Button color='primary' variant='outlined' endIcon={<Icon>arrow_back</Icon>} onClick={onClickBackButton}>Voltar</Button>
                    </Box>
                )}
            </Box>
        </Box>
    )
}