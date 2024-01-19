import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { ThemeProvider } from '@emotion/react'
import { DarkTheme, LightTheme } from './../themes'
import { Box } from '@mui/material'

interface IThemeContextData {
    themeName: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext({} as IThemeContextData)

export const useAppThemeContext = () => {
    return useContext(ThemeContext)
}

interface IAppThemeProviderProps {
    children: React.ReactNode
}

export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({ children }) => {
    const [themeName, setThemeName] = useState<'light' | 'dark'>(
        () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    )

    const toggleTheme = useCallback(() => {
        setThemeName((oldThemeName) => (oldThemeName === 'light' ? 'dark' : 'light'))
    }, [])

    useEffect(() => {
        // Salvar o tema no LocalStorage sempre que ele for alterado
        localStorage.setItem('theme', themeName)
    }, [themeName])

    const theme = useMemo(() => {
        return themeName === 'light' ? LightTheme : DarkTheme
    }, [themeName])

    return (
        <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <Box width="100%" height="100vh" bgcolor={theme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}