import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { IImageProductList, ProductService } from '../../../../shared/services/api/product/ProductService'

interface IUseHandleCustomerImage {
    setIsLoading: (status: boolean) => void
    setProductImages: (images: IImageProductList[]) => void
    setMainImage: (image: string) => void
    productImages: IImageProductList[]
    productId: number
}

const MAX_PRODUCT_IMAGES = 4

export const UseHandleProductImage = ({setIsLoading, setProductImages, setMainImage, productImages, productId}: IUseHandleCustomerImage ) => {

    const handleInsertImage = async (newImage: FileList) => {

        if (productImages.length >= MAX_PRODUCT_IMAGES) {
            toast.error('O produto não poder ter mais que 4 imagens!')
            return
        }
    
        setIsLoading(true)
    
        const [image] = newImage
    
        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)
    
        const result = await ProductService.insertNewImage(productId, formData)
        setIsLoading(false)
    
        if (result instanceof Error) {
            toast.error(result.message)
            return
        }
    
        //preparando para atualizar o state de imagens
        const newImageObject = result.data
        const newProductImages = [...productImages, newImageObject]
    
        setProductImages(newProductImages as IImageProductList[])
        toast.success('Imagem inserida com sucesso!')
    }

    const handleUpdateProductImage = async (id: number, newImage: FileList) => {
        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await ProductService.updateProductImage(id, productId, formData)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        const newUrl = result.data

        //Atualizar o state com as imagens do produto, junto com a url retornada do servidor
        const indexImage = productImages.findIndex(image => image.id === id)

        if (indexImage !== -1) {
            const newProductImages = productImages.map((image, index) => {
                if (index === indexImage) {
                    // Atualize a propriedade 'url' da imagem no objeto encontrado
                    return { ...image, url: newUrl }
                }
                return image
            })

            setProductImages(newProductImages)
        } else {
            toast.error('Erro inesperado ao atualizar imagem!')
        }

        toast.success('Imagem atualizada com sucesso!')
    }

    const handleUpdateMainImage = async (id: number, newImage: FileList) => {

        setIsLoading(true)

        const [image] = newImage

        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)

        const result = await ProductService.updateProductMainImage(id, formData)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        setMainImage(result.data)
        toast.success('Imagem atualizada com sucesso!')
    }

    const handleDeleteImage = async (id: number) => {

        if (productImages.length === 1) {
            toast.error('O produto precisa de no mínimo uma imagem!')
            return
        }

        if (confirm('Realmente deseja apagar a imagem')) {

            setIsLoading(true)

            const result = await ProductService.deleteProductImage(id, productId)
            setIsLoading(false)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            //preparando para atualizar o state de imagens
            const newProductImages = productImages.filter((image) => image.id !== id)
            setProductImages(newProductImages)

            toast.success('Imagem excluída com sucesso!')
        }

    }

    return { handleInsertImage, handleUpdateProductImage, handleUpdateMainImage, handleDeleteImage }
}


