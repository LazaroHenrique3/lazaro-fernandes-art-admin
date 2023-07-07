import { createTheme } from '@mui/material'

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1B98E0',
            dark: '#1F88C4',
            light: '#5DC2FD',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#000000',
            dark: '#545454',
            light: '#A6A6A6',
            contrastText: '#ffffff',
        },
        background: {
            default: '#303134',
            paper: '#202124'
        }
    },
    typography: {
        allVariants: {
            color: 'white'
        },
        button: {
            fontWeight: 700,
        }
    }
})

