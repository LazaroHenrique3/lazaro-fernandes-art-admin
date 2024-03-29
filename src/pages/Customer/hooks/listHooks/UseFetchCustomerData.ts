import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { CustomerService, IListCustomer } from '../../../../shared/services/api/customer/CustomerService'

interface IUseFetchCustomerDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (customers: IListCustomer[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
    status: string,
    genre: string,
    dateOfBirth: string
}

export const UseFetchCustomerData = ({setIsLoading, setRows, setTotalCount, search, page, status, genre, dateOfBirth}: IUseFetchCustomerDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await CustomerService.getAll(page, search, status, genre, dateOfBirth)
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }
    
                setRows(result.data)
                setTotalCount(result.totalCount)
            })
        }
    
        fetchData()
    
    }, [search, page, status, genre, dateOfBirth])
}

