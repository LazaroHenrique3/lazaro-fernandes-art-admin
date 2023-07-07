import { Box, Button, Icon, Paper, useTheme, Divider } from '@mui/material'

interface IDetailTools {
    newButtonText?: string

    showNewButton?: boolean
    showBackButton?: boolean
    showDeleteButton?: boolean
    showSaveButton?: boolean

    onClickNewButton?: () => void
    onClickBackButton?: () => void
    onClickDeleteButton?: () => void
    onClickSaveButton?: () => void
}

export const DetailTools: React.FC<IDetailTools> = ({
    newButtonText =  'Novo',

    showNewButton = true,
    showBackButton = true,
    showDeleteButton = true,
    showSaveButton = true,

    onClickNewButton,
    onClickBackButton,
    onClickDeleteButton,
    onClickSaveButton
}) => {
    const theme = useTheme()

    return (
        <Box marginX={1} padding={1} paddingX={2} display='flex' alignItems='center' gap={1} height={theme.spacing(5)} component={Paper}>
            {showSaveButton && (
                <Button color='primary' variant='contained' startIcon={<Icon>save</Icon>} onClick={onClickSaveButton}>Salvar</Button>
            )}
            {showDeleteButton && (
                <Button color='error' variant='outlined' startIcon={<Icon>delete</Icon>} onClick={onClickDeleteButton}>Apagar</Button>
            )}
            {showNewButton && (
                <Button color='success' variant='outlined' startIcon={<Icon>add</Icon>} onClick={onClickNewButton}>Novo</Button>
            )}

            <Divider variant='middle' orientation='vertical'/>

            {showBackButton && (
                <Button color='primary' variant='outlined' startIcon={<Icon>arrow_back</Icon>} onClick={onClickBackButton}>Voltar</Button>
            )}
        </Box>
    )
}