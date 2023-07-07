import { Routes, Route, Navigate } from 'react-router-dom'

import { useDrawerContext } from '../shared/contexts'
import { useEffect } from 'react'
import { Dashboard } from '../pages'

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext()

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
            <Route path='/admin-home' element={<Dashboard/>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}