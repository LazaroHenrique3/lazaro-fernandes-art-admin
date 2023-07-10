import axios from 'axios'

import { errorInterceptor, responseInterceptor } from './interceptors'
import { Environment } from '../../../enviroment'

const api = axios.create({
    baseURL: Environment.URL_BASE
})

//Enquanto não implemento a autenticação
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInR5cGVVc2VyIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WzEsMiwzLDQsNV0sImlhdCI6MTY4ODk5NTE2OSwiZXhwIjoxNjg5MDgxNTY5fQ.V9yC5-j5bKdVIfegJPGnj6MqHmBeQZeG_NdwABKkIlg'

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`
    return config
})

/* api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error)
) */

export { api }