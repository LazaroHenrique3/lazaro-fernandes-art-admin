import { Routes, Route} from 'react-router-dom'
import { useEffect } from 'react'

import { PrivateAdmin } from '../shared/components'

import '../shared/services/yup/TranslationsYup'
import { useDrawerContext } from '../shared/contexts'
import {
    Dashboard,
    CustomerList,
    CustomerDetails,
    AdministratorList,
    AdministratorDetails,
    ProductDetails,
    ProductList,
    CategoryDetails,
    CategoryList,
    TechniqueDetails,
    TechniqueList,
    DimensionDetails,
    DimensionList,
    LoginAdmin,
    ForgotPassword,
    RedefinePassword,
    PageNotFound,
} from '../pages'

export const AdminRoutes = () => {
    const { setDrawerOptions } = useDrawerContext()

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/admin/admin-home'
            },
            {
                label: 'Clientes',
                icon: 'supervisor_account_icon',
                path: '/admin/customer'
            },
            {
                label: 'Administradores',
                icon: 'manage_accounts_icon',
                path: '/admin/administrator'
            },
            {
                label: 'Produtos',
                icon: 'color_lens',
                path: '/admin/product'
            },
            {
                label: 'Categorias',
                icon: 'local_offer_icon',
                path: '/admin/category'
            },
            {
                label: 'Técnicas',
                icon: 'brush',
                path: '/admin/technique'
            },
            {
                label: 'Dimensões',
                icon: 'straighten_icon',
                path: '/admin/dimension'
            }
        ])
    }, [])

    return (
        <Routes>
            <Route path='/admin/login' element={<LoginAdmin />} />

            <Route path='/admin/forgot-password' element={<ForgotPassword />} />
            <Route path='/admin/redefine-password/:email' element={<RedefinePassword />} />

            <Route path='/admin/admin-home' element={<PrivateAdmin><Dashboard /></PrivateAdmin>} />

            <Route path='/admin/customer' element={<PrivateAdmin><CustomerList /></PrivateAdmin>} />
            <Route path='/admin/customer/details/:id' element={<PrivateAdmin><CustomerDetails /></PrivateAdmin>} />
            
            <Route path='/admin/administrator' element={<PrivateAdmin><AdministratorList /></PrivateAdmin>} />
            <Route path='/admin/administrator/details/:id' element={<PrivateAdmin><AdministratorDetails /></PrivateAdmin>} />

            <Route path='/admin/product' element={<PrivateAdmin><ProductList /></PrivateAdmin>} />
            <Route path='/admin/product/details/:id' element={<PrivateAdmin><ProductDetails /></PrivateAdmin>} />

            <Route path='/admin/category' element={<PrivateAdmin><CategoryList /></PrivateAdmin>} />
            <Route path='/admin/category/details/:id' element={<PrivateAdmin><CategoryDetails /></PrivateAdmin>} />

            <Route path='/admin/technique' element={<PrivateAdmin><TechniqueList /></PrivateAdmin>} />
            <Route path='/admin/technique/details/:id' element={<PrivateAdmin><TechniqueDetails /></PrivateAdmin>} />

            <Route path='/admin/dimension' element={<PrivateAdmin><DimensionList /></PrivateAdmin>} />
            <Route path='/admin/dimension/details/:id' element={<PrivateAdmin><DimensionDetails /></PrivateAdmin>} />

            <Route path='*' element={<PageNotFound/>} />
        </Routes>
    )
}