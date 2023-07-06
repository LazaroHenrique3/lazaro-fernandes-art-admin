import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppThemeProvider, DrawerProvider } from './shared/contexts'
import { SideNav } from './shared/components'


function App() {
    return (
        <DrawerProvider>
            <AppThemeProvider>
                <BrowserRouter>
                    <SideNav>
                        <AppRoutes />
                    </SideNav>
                </BrowserRouter>
            </AppThemeProvider>
        </DrawerProvider>
    )
}

export default App
