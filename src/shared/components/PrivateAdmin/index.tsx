import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts'
import { SideNav } from '../SideNav'

interface ILoginProps {
    children: React.ReactNode
}

export const PrivateAdmin: React.FC<ILoginProps> = ({ children }) => {
    const { isAuthenticated } = useAuthContext()

    const navigate = useNavigate()

    if (isAuthenticated) return (
        <SideNav>{children}</SideNav>
    ) 
    
    navigate('/admin/login')
    return null
}