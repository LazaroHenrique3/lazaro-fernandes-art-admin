import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../hooks'

import { AddressService, IListAddress } from '../../../../services/api/address/AddressService'

interface IUseFetchAddressDataProps {
    setIsLoading: (isLoading: boolean) => void
    setRows: (addresss: IListAddress[]) => void
    setTotalCount: (total: number) => void
    idUser: number
    rows: IListAddress[]
    search: string
    page: number
}

export const UseFetchAddressData = ({ setIsLoading, setRows, setTotalCount, idUser, rows, search, page }: IUseFetchAddressDataProps) => {
    
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {

        const fetchData = () => {
            debounce(async () => {
                setIsLoading(true)
                const result = await AddressService.getAll(page, search, idUser, false)

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }

                setRows([...rows, ...result.data])
                setTotalCount(result.totalCount)
            })
        }

        fetchData()

    }, [search, page])
}

