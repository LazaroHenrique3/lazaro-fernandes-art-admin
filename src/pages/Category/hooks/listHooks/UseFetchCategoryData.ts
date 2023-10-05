import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { CategoryService, IListCategory } from '../../../../shared/services/api/category/CategoryService'

interface IUseFetchCategoryDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (categorys: IListCategory[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
}

export const UseFetchCategoryData = ({setIsLoading, setRows, setTotalCount, search, page}: IUseFetchCategoryDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await CategoryService.getAll(page, search, true)
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

