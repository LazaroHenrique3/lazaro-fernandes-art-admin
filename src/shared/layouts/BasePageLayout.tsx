import { ReactNode } from 'react'

import { Icon, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/system'

import { useDrawerContext } from '../contexts'

interface IBasePageLayoutProps {
    children: React.ReactNode,
    title: string,
    toolBar?: ReactNode | undefined
}

export const BasePageLayout: React.FC<IBasePageLayoutProps> = ({ children, title, toolBar }) => {

    const theme = useTheme()

    //Retorna true ou false de acordo com o tamanho da tela
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))

    //Para pegar a função que abre e fecha o menu
    const { toggleDrawerOpen } = useDrawerContext()

    return (
        <Box height='100%' display='flex' flexDirection='column' gap={1}>
            <Box padding={1} display="flex" alignItems="center" height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} gap={1}>
                {smDown && (
                    <IconButton onClick={toggleDrawerOpen}>
                        <Icon>
                            menu
                        </Icon>
                    </IconButton>
                )}

                <Typography variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'} overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
                    {title}
                </Typography>
            </Box>

            {toolBar && (
                <Box>
                    {toolBar}
                </Box>
            )}

            <Box flex={1} overflow='auto'>
                {children}
            </Box>
        </Box>
    )
}