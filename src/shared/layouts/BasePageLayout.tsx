import { Icon, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/system'

import { useDrawerContext } from '../contexts'

interface IBasePageLayoutProps {
    children: React.ReactNode,
    title: string
}

export const BasePageLayout: React.FC<IBasePageLayoutProps> = ({ children, title }) => {

    const theme = useTheme()

    //Retorna true ou false de acordo com o tamanho da tela
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    //Para pegar a função que abre e fecha o menu
    const { toggleDrawerOpen } = useDrawerContext()

    return (
        <Box height='100%' display='flex' flexDirection='column' gap={1}>
            <Box padding={1} display="flex" alignItems="center" height={theme.spacing(12)} gap={1}>
                {smDown && (
                    <IconButton onClick={toggleDrawerOpen}>
                        <Icon>
                            menu
                        </Icon>
                    </IconButton>
                )}

                <Typography variant="h4">
                    {title}
                </Typography>
            </Box>

            <Box>
                Barra de ferramentas
            </Box>

            <Box>
                {children}
            </Box>
        </Box>
    )
}