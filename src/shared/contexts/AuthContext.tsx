import { createContext, useCallback, useMemo, useState, useEffect, useContext } from 'react'

import { AuthService } from '../services/api/auth/AuthService'
import { api } from '../services/api/axiosConfig'

interface IAuthContextData {
    name?: string
    isAuthenticated: boolean
    isLoading: boolean
    typeUser?: string
    logout: () => void
    login: (email: string, password: string) => Promise<string | void>
}

const AuthContext = createContext({} as IAuthContextData)

interface IAuthProviderProps {
    children: React.ReactNode
}

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN'
const LOCAL_STORAGE_KEY__USER_NAME = 'APP_USER_NAME'
const LOCAL_STORAGE_KEY__TYPE_USER = 'APP_TYPE_USER'

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>()
    const [name, setName] = useState<string>()
    const [typeUser, setTypeUser] = useState<string>()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        const name = localStorage.getItem(LOCAL_STORAGE_KEY__USER_NAME)
        const typeUser = localStorage.getItem(LOCAL_STORAGE_KEY__TYPE_USER)

        if (accessToken && name && typeUser) {
            api.defaults.headers.Authorization = `Bearer ${accessToken}`
            
            setAccessToken(accessToken)
            setName(JSON.parse(name))
            setTypeUser(JSON.parse(typeUser))
        } else {
            setAccessToken(undefined)
            setName(undefined)
            setTypeUser(undefined)
        }

        setLoading(false)
    }, [])

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password)

        if (result instanceof Error) {
            return result.message
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, result.accessToken)
            localStorage.setItem(LOCAL_STORAGE_KEY__USER_NAME, JSON.stringify(result.name))
            localStorage.setItem(LOCAL_STORAGE_KEY__TYPE_USER, JSON.stringify(result.typeUser))

            api.defaults.headers.Authorization = `Bearer ${result.accessToken}`
            
            setAccessToken(result.accessToken)
            setName(result.name)
            setTypeUser(result.typeUser)
        }
        
    }, [])

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_NAME)
        localStorage.removeItem(LOCAL_STORAGE_KEY__TYPE_USER)

        api.defaults.headers.Authorization = null
        setAccessToken(undefined)
    }, [])

    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    const isLoading = useMemo(() => loading, [loading])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, typeUser, name, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)