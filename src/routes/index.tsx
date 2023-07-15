import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import { PrivateAdmin } from '.././shared/components'

import '../shared/services/yup/TranslationsYup'
import { useDrawerContext } from '../shared/contexts'
import {
    Dashboard,
    CategoryDetails,
    CategoryList,
    TechniqueDetails,
    TechniqueList,
    DimensionDetails,
    DimensionList,
    LoginAdmin
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
                icon: 'local_offer_icon',
                path: '/category'
            },
            {
                label: 'Técnicas',
                icon: 'brush',
                path: '/technique'
            },
            {
                label: 'Dimensões',
                icon: 'straighten_icon',
                path: '/dimension'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/admin/login' element={<LoginAdmin />} />

            <Route path='/admin-home' element={<PrivateAdmin><Dashboard /></PrivateAdmin>} />

            <Route path='/category' element={<PrivateAdmin><CategoryList /></PrivateAdmin>} />
            <Route path='/category/details/:id' element={<PrivateAdmin><CategoryDetails /></PrivateAdmin>} />

            <Route path='/technique' element={<PrivateAdmin><TechniqueList /></PrivateAdmin>} />
            <Route path='/technique/details/:id' element={<PrivateAdmin><TechniqueDetails /></PrivateAdmin>} />

            <Route path='/dimension' element={<PrivateAdmin><DimensionList /></PrivateAdmin>} />
            <Route path='/dimension/details/:id' element={<PrivateAdmin><DimensionDetails /></PrivateAdmin>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}