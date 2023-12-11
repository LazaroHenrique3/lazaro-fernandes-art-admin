import * as yup from 'yup'
import { FormHandles } from '@unform/core'
import { useNavigate } from 'react-router-dom'

import { IVFormErrors } from '../../../../shared/forms'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { 
    IFormData, 
    IFormDataUpdate, 
    formatValidationSchema, 
    formatValidationSchemaUpdate
} from '../../validation/Schemas'

import { IDetailProductUpdate, ProductService } from '../../../../shared/services/api/product/ProductService'

interface IUseHandleProduct {
    setIsLoading: (status: boolean) => void
    setName: (name: string) => void
    formRef: React.RefObject<FormHandles>
    id: string
}

export const UseHandleProduct = ({setIsLoading, setName, formRef, id}: IUseHandleProduct) => {
    const navigate = useNavigate()

    const handleSave = async (data: IFormData) => {
        try {
            let validateData: IFormData | IFormDataUpdate
    
            //Verificando se é update ou novo
            if (id === 'new') {
                validateData = await formatValidationSchema.validate(data, { abortEarly: false })
            } else {
                validateData = await formatValidationSchemaUpdate.validate(data, { abortEarly: false })
            }
    
            setIsLoading(true)

            const formData = new FormData()
            formData.append('status', validateData.status)
            formData.append('type', validateData.type)
            formData.append('title', validateData.title)
            formData.append('orientation', validateData.orientation)
            formData.append('production_date', String(validateData.production_date))
            formData.append('description', String(validateData.description))
            formData.append('dimension_id', String(validateData.dimension_id))
            formData.append('technique_id', String(validateData.technique_id))
            formData.append('category_id', String(validateData.category_id))
            formData.append('quantity', String(validateData.quantity))
            formData.append('weight', String(validateData.weight))
            formData.append('price', String(validateData.price))
    
            //Se for novo registro eu devo adicionar as imagens
            if (id === 'new' && 'main_image' in validateData && 'product_images' in validateData) {
    
                const [formattedMainImage] = validateData.main_image
    
                formData.append('main_image', formattedMainImage)
    
                // Adicionando as imagens do produto
                for (let i = 0; i < validateData.product_images.length; i++) {
                    formData.append('product_images', validateData.product_images[i])
                }
    
                const result = await ProductService.create(formData)
    
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                } else {
                    toast.success('Registro salvo com sucesso!')
                    navigate(`/admin/product/details/${result}`)
                }
    
            } else {
    
                const result = await ProductService.updateById(Number(id), validateData as IDetailProductUpdate)
                
                setIsLoading(false)
    
                if (result instanceof Error) {
                    toast.error(result.message)
                    return
                }
    
                toast.success('Registro salvo com sucesso!')
                setName(validateData.title)
    
            }
    
        } catch (errors) {
    
            const errorsYup: yup.ValidationError = errors as yup.ValidationError
    
            const validationErrors: IVFormErrors = {}
    
            errorsYup.inner.forEach(error => {
                if (!error.path) return
    
                validationErrors[error.path] = error.message
                formRef.current?.setErrors(validationErrors)
            })
        }
    }

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await ProductService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            toast.success('Registro apagado com sucesso!')
            navigate('/admin/product')
        }
    }

    return { handleSave, handleDelete }
}

