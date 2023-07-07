import { createTheme } from '@mui/material'

export const LightTheme = createTheme({
    palette: {
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
            default: '#ffffff',
            paper: '#f7f6f3'
        }
    },
    typography: {
        button: {
            fontWeight: 700,
        }
    }
})

