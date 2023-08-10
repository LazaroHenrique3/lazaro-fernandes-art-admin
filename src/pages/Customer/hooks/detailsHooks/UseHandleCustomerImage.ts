import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CustomerService } from '../../../../shared/services/api/customer/CustomerService'

interface IUseHandleCustomerImage {
    setIsLoading: (status: boolean) => void
    setImage: (image: string) => void
    id: string
}

export const UseHandleCustomerImage = ({setIsLoading, setImage, id}: IUseHandleCustomerImage) => {

    const handleUpdateImage = async (id: number, newImage: FileList) => {
        setIsLoading(true)
    
        const [image] = newImage
        //convertendo em formdata
        const formData = new FormData()
    
        formData.append('image', image)
    
        const result = await CustomerService.updateCustomerImage(Number(id), formData)
    
        setIsLoading(false)
    
        if (result instanceof Error) {
            toast.error(result.message)
            return
        }
    
        setImage(result.data)
        toast.success('Imagem atualizada com sucesso!')
    }

    const handleInsertImage = async (newImage: FileList) => {
        setIsLoading(true)
    
        const [image] = newImage
    
        //convertendo em formdata
        const formData = new FormData()
        formData.append('image', image)
    
        const result = await CustomerService.insertNewImage(Number(id), formData)
        setIsLoading(false)
    
        if (result instanceof Error) {
            toast.error(result.message)
            return
        }
    
        //preparando para atualizar o state de imagens
        const newImageCustomer = result.data
    
        setImage(newImageCustomer)
        toast.success('Imagem inserida com sucesso!')
    }

    const handleDeleteImage = async () => {
        if (confirm('Realmente deseja apagar a imagem')) {
    
            setIsLoading(true)
    
            const result = await CustomerService.deleteCustomerImage(Number(id))
            setIsLoading(false)
    
            if (result instanceof Error) {
                toast.error(result.message)
                return
            }
    
            setImage('')
            toast.success('Imagem excluída com sucesso!')
        }
    }

    return {handleUpdateImage, handleInsertImage, handleDeleteImage }
}


