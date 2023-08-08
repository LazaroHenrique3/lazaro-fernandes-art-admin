import { Routes, Route} from 'react-router-dom'
import { useEffect } from 'react'

import '../shared/services/yup/TranslationsYup'

import { useNavBarContext } from '../shared/contexts'

import {
    Home,
    PageNotFound,
} from '../pages'

export const MainRoutes = () => {
    const { setPagesOptions, setSettingsOptions } = useNavBarContext()

    useEffect(() => {
        setPagesOptions([
            {
                label: 'Home',
                path: '/admin/admin-home'
            },
            {
                label: 'Loja',
                path: '/admin/customer'
            },
            {
                label: 'Sobre',
                path: '/admin/administrator'
            },
            {
                label: 'Contato',
                path: '/admin/administrator'
            },
        ])

        setSettingsOptions([
            {
                label: 'Meu perfil',
                path: '/customer/profile'
            },
            {
                label: 'Logout',
                path: '/customer/logout'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/home' element={<Home />} />

            <Route path='*' element={<PageNotFound/>} />
        </Routes>
    )
}