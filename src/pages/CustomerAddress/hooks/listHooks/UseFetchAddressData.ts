import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDebounce } from '../../../../shared/hooks'

import { AddressService, IListAddress } from '../../../../shared/services/api/address/AddressService'

interface IUseFetchAddressDataProps {
    setIsLoading: (status: boolean) => void
    setRows: (addresss: IListAddress[]) => void
    setTotalCount: (total: number) => void
    search: string
    page: number
    idCustomer: string
}

export const UseFetchAddressData = ({ setIsLoading, setRows, setTotalCount, search, page, idCustomer }: IUseFetchAddressDataProps) => {

    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)

        const fetchData = () => {
            debounce(async () => {

                const result = await AddressService.getAll(page, search, Number(idCustomer))
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

