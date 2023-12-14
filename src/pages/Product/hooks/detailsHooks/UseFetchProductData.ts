import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { 
    IImageProductList, 
    ProductService,
    TProductStatus,  
} from '../../../../shared/services/api/product/ProductService'

const INITIAL_FORM_VALUES = {
    status: '',
    type: '',
    title: '',
    orientation: '',
    main_image: '',
    product_images: '',
    production_date: '',
    quantity: '',
    description: '',
    weight: '',
    price: '',
    dimension_id: '',
    technique_id: '',
    category_id: '',
}

interface IUseFetchProductDataProps {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    setProductId: (id: number) => void
    setMainImage: (image: string) => void
    setProductImages: (images: IImageProductList[]) => void
    setProductStatus: (status: TProductStatus) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseFetchProductData = ({
    setIsLoading,
    setName,
    setProductId,
    setMainImage,
    setProductImages,
    setProductStatus,
    formRef,
    id
}: IUseFetchProductDataProps) => {
    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {

            if (id !== 'new') {
                setIsLoading(true)
                const result = await ProductService.getById(Number(id))

                setIsLoading(false)

                if (result instanceof Error) {
                    toast.error(result.message)
                    navigate('/admin/product')
                    return
                }

                const { main_image, product_images, ...resultData } = result

                setName(result.title)
                setProductId(result.id)
                setMainImage(main_image)
                setProductImages(product_images)
                setProductStatus(result.status)

                formRef.current?.setData(resultData)
            } else {
                formRef.current?.setData(INITIAL_FORM_VALUES)
            }

            return
        }

        fetchData()

    }, [id])
}


