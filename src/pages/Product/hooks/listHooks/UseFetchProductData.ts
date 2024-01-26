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
    status: string,
    type: string,
    orientation: string,
    category: string,
    technique: string,
    dimension: string,
    productionDate: string,
    orderByPrice: string
}

export const UseFetchProductData = ({
    setIsLoading,
    setRows,
    setTotalCount,
    search,
    page,
    status,
    type,
    orientation,
    category,
    technique,
    dimension,
    productionDate,
    orderByPrice
}: IUseFetchProductDataProps) => {
    //Para adicionar delay na pesquisa
    const { debounce } = useDebounce()

    useEffect(() => {
        setIsLoading(true)

        const fetchData = () => {
            debounce(async () => {
                const result = await ProductService.getAll(page, search, status, type, orientation, category, technique, dimension, productionDate, orderByPrice)
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

    }, [search, page, status, type, orientation, category, technique, dimension, productionDate, orderByPrice])
}

