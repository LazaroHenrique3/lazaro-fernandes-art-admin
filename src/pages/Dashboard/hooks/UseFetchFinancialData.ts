import { useEffect } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    SaleService,
    IFinancialInformations
} from '../../../shared/services/api/sales/SaleService'

interface IUseFetchSaleDataProps {
    setIsLoading: (status: boolean) => void
    setFinancialData: (data: IFinancialInformations) => void
}

export const UseFetchFinancialData = ({ setIsLoading, setFinancialData }: IUseFetchSaleDataProps) => {


    useEffect(() => {
        setIsLoading(true)

        const fetchData = async () => {
            const result = await SaleService.getFinancialInformation()
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            setFinancialData(result)
        }

        fetchData()

    }, [])
}

