import { createContext, useCallback, useMemo, useState, useEffect, useContext } from 'react'

import { AuthService } from '../services/api/auth/AuthService'

interface IAuthContextData {
    name?: string
    isAuthenticated: boolean
    typeUser?: string
    userPermissions?: number[]
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
const LOCAL_STORAGE_KEY__USER_PERMISSIONS = 'APP_USER_PERMISSIONS'

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>()
    const [name, setName] = useState<string>()
    const [typeUser, setTypeUser] = useState<string>()
    const [userPermissions, setuserPermissions] = useState<number[]>()

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        const name = localStorage.getItem(LOCAL_STORAGE_KEY__USER_NAME)
        const typeUser = localStorage.getItem(LOCAL_STORAGE_KEY__TYPE_USER)
        const userPermissions = localStorage.getItem(LOCAL_STORAGE_KEY__USER_PERMISSIONS)

        if (accessToken && name && typeUser && userPermissions) {
            setAccessToken(JSON.parse(accessToken))
            setName(JSON.parse(name))
            setTypeUser(JSON.parse(typeUser))
            setuserPermissions(JSON.parse(userPermissions))
        } else {
            setAccessToken(undefined)
            setName(undefined)
            setTypeUser(undefined)
            setuserPermissions(undefined)
        }

    }, [])

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password)

        if (result instanceof Error) {
            return result.message
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.accessToken))
            localStorage.setItem(LOCAL_STORAGE_KEY__USER_NAME, JSON.stringify(result.name))
            localStorage.setItem(LOCAL_STORAGE_KEY__TYPE_USER, JSON.stringify(result.typeUser))
            localStorage.setItem(LOCAL_STORAGE_KEY__USER_PERMISSIONS, JSON.stringify(result.permissions))


            setAccessToken(result.accessToken)
            setName(result.name)
            setTypeUser(result.typeUser)
            setuserPermissions(result.permissions)
        }
        
    }, [])

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_NAME)
        localStorage.removeItem(LOCAL_STORAGE_KEY__TYPE_USER)
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_PERMISSIONS)
        setAccessToken(undefined)
    }, [])

    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])

    return (
        <AuthContext.Provider value={{ isAuthenticated, typeUser, userPermissions, name, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)