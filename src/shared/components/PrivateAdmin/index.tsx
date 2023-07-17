import { Box, CircularProgress } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts'
import { SideNav } from '../SideNav'

interface ILoginProps {
    children: React.ReactNode
}

export const PrivateAdmin: React.FC<ILoginProps> = ({ children }) => {
    const { isAuthenticated, isLoading, typeUser } = useAuthContext()

    const navigate = useNavigate()

    //Se ainda estiver na etapa de loading la na autenticação
    if (isLoading) {
        return (
            <Box width='100%' height='100vh' display='flex' alignItems='center' justifyContent='center'>...
                <CircularProgress variant='indeterminate' color='inherit' size={40} />
            </Box>
        )
    }

    if (isAuthenticated && typeUser === 'admin') return (
        <SideNav>{children}</SideNav>
    )

    navigate('/admin/login')
    return null
}