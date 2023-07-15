import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppThemeProvider, DrawerProvider, AuthProvider } from './shared/contexts'


function App() {
    return (
        <AuthProvider>
            <AppThemeProvider>
                <DrawerProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </DrawerProvider>
            </AppThemeProvider>
        </AuthProvider>
    )
}

export default App
