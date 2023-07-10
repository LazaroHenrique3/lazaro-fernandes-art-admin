import { Box, Button, Icon, Paper, useTheme, Divider, Skeleton, Typography, useMediaQuery } from '@mui/material'

interface IDetailTools {
    newButtonText?: string

    showNewButton?: boolean
    showBackButton?: boolean
    showDeleteButton?: boolean
    showSaveButton?: boolean

    showNewButtonLoading?: boolean
    showBackButtonLoading?: boolean
    showDeleteButtonLoading?: boolean
    showSaveButtonLoading?: boolean

    onClickNewButton?: () => void
    onClickBackButton?: () => void
    onClickDeleteButton?: () => void
    onClickSaveButton?: () => void
}

export const DetailTools: React.FC<IDetailTools> = ({
    newButtonText = 'Novo',

    showNewButton = true,
    showBackButton = true,
    showDeleteButton = true,
    showSaveButton = true,

    showNewButtonLoading = false,
    showBackButtonLoading = false,
    showDeleteButtonLoading = false,
    showSaveButtonLoading = false,

    onClickNewButton,
    onClickBackButton,
    onClickDeleteButton,
    onClickSaveButton
}) => {
    const theme = useTheme()

    //Retorna true ou false de acordo com o tamanho da tela
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    //const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box marginX={1} padding={1} paddingX={2} display='flex' alignItems='center' gap={1} height={theme.spacing(5)} component={Paper}>
            {(showSaveButton && !showSaveButtonLoading) && (
                <Button color='primary' variant='contained' startIcon={<Icon>save</Icon>} onClick={onClickSaveButton}>
                    <Typography variant='button' fontSize={12} fontWeight={600} noWrap>
                        Salvar
                    </Typography>
                </Button>
            )}

            {showSaveButtonLoading && (
                <Skeleton width={110} height={60} />
            )}

            {(showNewButton && !showNewButtonLoading && !smDown) && (
                <Button color='success' variant='outlined' startIcon={<Icon>add</Icon>} onClick={onClickNewButton}>
                    <Typography variant='button' fontSize={12} fontWeight={600} noWrap>
                        {newButtonText}
                    </Typography>
                </Button>
            )}

            {(showNewButtonLoading && !smDown) && (
                <Skeleton width={110} height={60} />
            )}

            {(showDeleteButton && !showDeleteButtonLoading) && (
                <Button color='error' variant='outlined' startIcon={<Icon>delete</Icon>} onClick={onClickDeleteButton}>
                    <Typography variant='button' fontSize={12} fontWeight={600} noWrap>
                        Apagar
                    </Typography>
                </Button>
            )}

            {showDeleteButtonLoading && (
                <Skeleton width={110} height={60} />
            )}

            {
                (showBackButton &&
                    (showNewButton || showDeleteButton || showSaveButton)
                ) && (
                    < Divider variant='middle' orientation='vertical' />
                )
            }

            {(showBackButton && !showBackButtonLoading) && (
                <Button color='primary' variant='outlined' startIcon={<Icon>arrow_back</Icon>} onClick={onClickBackButton}>
                    <Typography variant='button' fontSize={12} fontWeight={600} noWrap>
                        Voltar
                    </Typography>
                </Button>
            )}

            {showBackButtonLoading && (
                <Skeleton width={110} height={60} />
            )}
        </Box>
    )
}