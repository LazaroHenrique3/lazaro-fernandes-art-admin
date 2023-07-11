import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useDrawerContext } from '../shared/contexts'
import {
    Dashboard,
    CategoryList
} from '../pages'

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext()

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/admin-home'
            },
            {
                label: 'Categorias',
                icon:  'local_offer_icon',
                path: '/category'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/admin-home' element={<Dashboard />} />

            <Route path='/category' element={<CategoryList />} />
            <Route path='/category/details/:id' element={<Dashboard/>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}