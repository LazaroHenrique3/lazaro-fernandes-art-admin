import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppThemeProvider, DrawerProvider, AuthProvider } from './shared/contexts'

//Importando o Toasts
import { ToastContainer, toast  } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <AuthProvider>
            <AppThemeProvider>
                <DrawerProvider>
                    <BrowserRouter>
                        <AppRoutes />
                        <ToastContainer autoClose={5000} position={toast.POSITION.BOTTOM_LEFT} />
                    </BrowserRouter>
                </DrawerProvider>
            </AppThemeProvider>
        </AuthProvider>
    )
}

export default App
