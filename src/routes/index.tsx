import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import '../shared/services/yup/TranslationsYup'
import { useDrawerContext } from '../shared/contexts'
import {
    Dashboard,
    CategoryDetails,
    CategoryList,
    TechniqueDetails,
    TechniqueList,
    DimensionDetails,
    DimensionList
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
            },
            {
                label: 'Técnicas',
                icon:  'brush',
                path: '/technique'
            },
            {
                label: 'Dimensões',
                icon:  'straighten_icon',
                path: '/dimension'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/admin-home' element={<Dashboard />} />

            <Route path='/category' element={<CategoryList />} />
            <Route path='/category/details/:id' element={<CategoryDetails/>} />
            
            <Route path='/technique' element={<TechniqueList />} />
            <Route path='/technique/details/:id' element={<TechniqueDetails/>} />

            <Route path='/dimension' element={<DimensionList />} />
            <Route path='/dimension/details/:id' element={<DimensionDetails/>} />

            <Route path='*' element={<Navigate to="/admin-home" />} />
        </Routes>
    )
}