import { BrowserRouter } from 'react-router-dom'

import {
    AppThemeProvider,
    DrawerProvider,
    AuthProvider
} from './shared/contexts'

import { AdminRoutes } from './routes'

//Importando o Toasts
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <AuthProvider>
            <AppThemeProvider>

                <BrowserRouter>

                    <DrawerProvider>
                        <AdminRoutes />
                    </DrawerProvider>

                    <ToastContainer autoClose={5000} position={toast.POSITION.BOTTOM_LEFT} />
                </BrowserRouter>

            </AppThemeProvider>
        </AuthProvider>
    )
}

export default App
