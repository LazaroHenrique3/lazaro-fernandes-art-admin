import { createContext, useCallback, useMemo, useState, useEffect, useContext } from 'react'

import { AuthService } from '../services/api/auth/AuthService'

interface IAuthContextData {
    name?: string
    isAuthenticated: boolean
    logout: () => void
    login: (email: string, password: string) => Promise<string | void>
}

const AuthContext = createContext({} as IAuthContextData)

interface IAuthProviderProps {
    children: React.ReactNode
}

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN'
const LOCAL_STORAGE_KEY__USER_NAME = 'APP_USER_NAME'

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>()
    const [name, setName] = useState<string>()

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        const name = localStorage.getItem(LOCAL_STORAGE_KEY__USER_NAME)

        if (accessToken && name) {
            setAccessToken(JSON.parse(accessToken))
            setName(JSON.parse(name))
        } else {
            setAccessToken(undefined)
            setName(undefined)
        }

    }, [])

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password)

        if (result instanceof Error) {
            return result.message
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.accessToken))
            localStorage.setItem(LOCAL_STORAGE_KEY__USER_NAME, JSON.stringify(result.name))

            setAccessToken(result.accessToken)
            setName(result.name)
        }
        
    }, [])

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_NAME)
        setAccessToken(undefined)
    }, [])

    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])

    return (
        <AuthContext.Provider value={{ isAuthenticated,  name, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)