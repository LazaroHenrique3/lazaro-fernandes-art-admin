import axios from 'axios'

import { errorInterceptor, responseInterceptor } from './interceptors'
import { Environment } from '../../../enviroment'

const appAccessToken = localStorage.getItem('APP_ACCESS_TOKEN')
const token = appAccessToken ? JSON.parse(appAccessToken) : ''

const api = axios.create({
    baseURL: Environment.URL_BASE,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
) 

export { api }