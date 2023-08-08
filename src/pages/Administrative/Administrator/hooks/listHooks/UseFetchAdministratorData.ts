import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../../shared/hooks'

import { AdministratorService, IListAdministrator } from '../../../../../shared/services/api/administrator/AdministratorService'

interface IUseFetchAdministratorDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (administrators: IListAdministrator[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
}

export const UseFetchAdministratorData = ({setIsLoading, setRows, setTotalCount, search, page}: IUseFetchAdministratorDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)
    
        const fetchData = () => {
            debounce(async () => {
                const result = await AdministratorService.getAll(page, search)
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

