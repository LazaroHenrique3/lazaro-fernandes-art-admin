import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { DimensionService, IListDimension } from '../../../../shared/services/api/dimension/DimensionService'

interface IUseFetchDimensionDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (dimensions: IListDimension[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
    status: string
}

export const UseFetchDimensionData = ({setIsLoading, setRows, setTotalCount, search, page, status}: IUseFetchDimensionDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await DimensionService.getAll(page, search, status, true)
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
    
    }, [search, page, status])
}

