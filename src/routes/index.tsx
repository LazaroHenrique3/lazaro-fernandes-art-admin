import { Button } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useDrawerContext } from '../shared/contexts'

export const AppRoutes = () => {
    const { toggleDrawerOpen } = useDrawerContext()

    return (
        <Routes>
            <Route path='/admin-home' element={<Button variant='contained' color='primary' onClick={toggleDrawerOpen}>Toggle Drawer</Button>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}