import { createContext, useCallback, useMemo, useState, useEffect, useContext } from 'react'

import { AuthService } from '../services/api/auth/AuthService'
import { api } from '../services/api/axiosConfig'

interface IAuthContextData {
    name?: string
    idUser?: number
    isAuthenticated: boolean
    isLoading: boolean
    typeUser?: string
    accessLevel?: string
    handleName: (name: string) => void
    logout: () => void
    login: (email: string, password: string) => Promise<string | void>
}

const AuthContext = createContext({} as IAuthContextData)

interface IAuthProviderProps {
    children: React.ReactNode
}

const LOCAL_STORAGE_KEY__USER_NAME = 'APP_USER_NAME'
const LOCAL_STORAGE_KEY__USER_ID = 'APP_USER_ID'
const LOCAL_STORAGE_KEY__TYPE_USER = 'APP_TYPE_USER'
const LOCAL_STORAGE_KEY__ACCESS_LEVEL = 'ACCESS_LEVEL'
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN'


export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [name, setName] = useState<string>()
    const [idUser, setUserId] = useState<number>()
    const [typeUser, setTypeUser] = useState<string>()
    const [accessLevel, setAccessLevel] = useState<string>()
    const [accessToken, setAccessToken] = useState<string>()


    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const name = localStorage.getItem(LOCAL_STORAGE_KEY__USER_NAME)
        const idUser = localStorage.getItem(LOCAL_STORAGE_KEY__USER_ID)
        const typeUser = localStorage.getItem(LOCAL_STORAGE_KEY__TYPE_USER)
        const accessLevel = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_LEVEL)
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)

        if (accessToken && name && typeUser && accessLevel && idUser) {
            api.defaults.headers.Authorization = `Bearer ${accessToken}`

            setName(JSON.parse(name))
            setUserId(Number(JSON.parse(idUser)))
            setTypeUser(JSON.parse(typeUser))
            setAccessLevel(JSON.parse(accessLevel))
            setAccessToken(accessToken)
        } else {
            setName(undefined)
            setUserId(undefined)
            setTypeUser(undefined)
            setAccessLevel(undefined)
            setAccessToken(undefined)
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
            localStorage.setItem(LOCAL_STORAGE_KEY__USER_ID, JSON.stringify(result.idUser))
            localStorage.setItem(LOCAL_STORAGE_KEY__TYPE_USER, JSON.stringify(result.typeUser))
            localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_LEVEL, JSON.stringify(result.accessLevel))

            api.defaults.headers.Authorization = `Bearer ${result.accessToken}`

            setName(result.name)
            setUserId(Number(result.idUser))
            setTypeUser(result.typeUser)
            setAccessLevel(result.accessLevel)
            setAccessToken(result.accessToken)
        }

    }, [])

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_NAME)
        localStorage.removeItem(LOCAL_STORAGE_KEY__USER_ID)
        localStorage.removeItem(LOCAL_STORAGE_KEY__TYPE_USER)
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_LEVEL)
        localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN)

        api.defaults.headers.Authorization = null
        setAccessToken(undefined)
    }, [])

    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    const isLoading = useMemo(() => loading, [loading])

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            typeUser,
            name,
            idUser,
            accessLevel,
            handleName: setName,
            login: handleLogin,
            logout: handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)