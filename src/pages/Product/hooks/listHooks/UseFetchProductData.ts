import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { ProductService, IListProduct } from '../../../../shared/services/api/product/ProductService'

interface IUseFetchProductDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (products: IListProduct[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
}

export const UseFetchProductData = ({setIsLoading, setRows, setTotalCount, search, page}: IUseFetchProductDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await ProductService.getAll(page, search)
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
    
    }, [search, page])
}

