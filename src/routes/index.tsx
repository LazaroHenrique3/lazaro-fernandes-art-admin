import { Button } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useDrawerContext } from '../shared/contexts'
import { useEffect } from 'react'

export const AppRoutes = () => {
    const { toggleDrawerOpen, setDrawerOptions } = useDrawerContext()

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/admin-home'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/admin-home' element={<Button variant='contained' color='primary' onClick={toggleDrawerOpen}>Toggle Drawer</Button>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}