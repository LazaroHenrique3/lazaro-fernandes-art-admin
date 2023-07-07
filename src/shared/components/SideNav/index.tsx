import {
    Avatar,
    Divider, Drawer,
    Icon,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material'

import { Box } from '@mui/material'

import { useDrawerContext } from '../../contexts'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'

interface IListItemLinkProps {
    to: string,
    label: string,
    icon: string,
    onClick: (() => void) | undefined
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, label, icon, onClick }) => {
    const navigate = useNavigate()

    //Descobrindo se a rota foi seleciona ou não através da url
    const resolvePath = useResolvedPath(to)
    const match = useMatch({ path: resolvePath.pathname, end: false })

    const handleClick = () => {
        onClick?.()
        navigate(to)
    }

    return (
        <ListItemButton selected={!!match} onClick={handleClick}>
            <ListItemIcon>
                <Icon>
                    {icon}
                </Icon>
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    )
}

interface IDrawerProps {
    children: React.ReactNode
}

export const SideNav: React.FC<IDrawerProps> = ({ children }) => {
    //Consegue acessao o theme que estamos usando
    const theme = useTheme()

    //Retorna true ou false de acordo com o tamanho da tela
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext()

    return (
        <>
            <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
                <Box width={theme.spacing(28)} height='100%' display='flex' flexDirection='column'>

                    <Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center'>
                        <Avatar
                            sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
                            src='https://avatars.githubusercontent.com/u/78514404?v=4' />
                    </Box>

                    <Divider />

                    <Box flex={1}>
                        <List component="nav">
                            {drawerOptions.map(drawerOption => (
                                <ListItemLink to={drawerOption.path} key={drawerOption.path} icon={drawerOption.icon} label={drawerOption.label} onClick={smDown ? toggleDrawerOpen : undefined}/>
                            ))}
                        </List>
                    </Box>

                </Box>
            </Drawer>

            <Box height='100vh' marginLeft={smDown ? 0 : theme.spacing(28)}>
                {children}
            </Box>
        </>
    )
}