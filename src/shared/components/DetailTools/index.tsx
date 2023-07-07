import { Box, Button, Icon, Paper, useTheme, Divider } from '@mui/material'

export const DetailTools: React.FC = () => {
    const theme = useTheme()

    return (
        <Box marginX={1} padding={1} paddingX={2} display='flex' alignItems='center' gap={1} height={theme.spacing(5)} component={Paper}>
            <Button color='primary' variant='contained' startIcon={<Icon>save</Icon>}>Salvar</Button>
            <Button color='error' variant='outlined' startIcon={<Icon>delete</Icon>}>Apagar</Button>
            <Button color='success' variant='outlined' startIcon={<Icon>add</Icon>}>Novo</Button>

            <Divider variant='middle' orientation='vertical'/>

            <Button color='primary' variant='outlined' startIcon={<Icon>arrow_back</Icon>}>Voltar</Button>
        </Box>
    )
}