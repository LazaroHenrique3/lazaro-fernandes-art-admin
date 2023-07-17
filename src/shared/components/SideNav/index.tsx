import {
    Avatar,
    Divider, Drawer,
    Icon,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Button
} from '@mui/material'

import { Box } from '@mui/material'

import { useAppThemeContext, useDrawerContext, useAuthContext } from '../../contexts'
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
    //Consegue acessar o theme que estamos usando
    const theme = useTheme()

    //Retorna true ou false de acordo com o tamanho da tela
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    //Nome do usuário logado
    const { name } = useAuthContext()

    const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext()

    const { toggleTheme } = useAppThemeContext()
    const { logout } = useAuthContext()

    return (
        <>
            <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
                <Box width={theme.spacing(28)} height='100%' display='flex' flexDirection='column'>

                    <Box width='100%' height={theme.spacing(20)} marginY={1} display='flex' gap={1} alignItems='center' justifyContent='center' flexDirection='column'>
                        <Avatar
                            sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
                            src='https://avatars.githubusercontent.com/u/78514404?v=4' />

                        <Button variant='outlined' startIcon={<Icon>account_circle_icon</Icon>}>
                            {name}
                        </Button>
                    </Box>

                    <Divider />

                    <Box flex={1}>
                        <List component="nav">
                            {drawerOptions.map(drawerOption => (
                                <ListItemLink to={drawerOption.path} key={drawerOption.path} icon={drawerOption.icon} label={drawerOption.label} onClick={smDown ? toggleDrawerOpen : undefined} />
                            ))}
                        </List>
                    </Box>

                    <Box>
                        <List component="nav">
                            <ListItemButton onClick={toggleTheme}>
                                <ListItemIcon>
                                    <Icon>
                                        brightness_4_icon
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText primary='Alternar tema' />
                            </ListItemButton>

                            <ListItemButton onClick={logout}>
                                <ListItemIcon>
                                    <Icon>
                                        logout
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText primary='Sair' />
                            </ListItemButton>
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