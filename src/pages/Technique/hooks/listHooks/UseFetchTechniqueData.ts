import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { TechniqueService, IListTechnique } from '../../../../shared/services/api/technique/TechniqueService'

interface IUseFetchTechniqueDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (techniques: IListTechnique[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
}

export const UseFetchTechniqueData = ({setIsLoading, setRows, setTotalCount, search, page}: IUseFetchTechniqueDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await TechniqueService.getAll(page, search)
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

