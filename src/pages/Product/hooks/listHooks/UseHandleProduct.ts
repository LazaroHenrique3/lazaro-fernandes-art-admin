import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ProductService, IListProduct } from '../../../../shared/services/api/product/ProductService'

interface IUseHandleProduct {
    setRows: (products: IListProduct[]) => void
    rows:  IListProduct[]
    search: string
    status: string
    type: string
    orientation: string
    category: string
    technique: string
    dimension: string
    productionDate: string
    orderByPrice: string
}

export const UseHandleProduct = ({ 
    setRows, 
    rows, 
    search,
    status,
    type,
    orientation,
    category,
    technique,
    dimension,
    productionDate,
    orderByPrice
}: IUseHandleProduct) => {

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await ProductService.deleteById(id)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            const newRows = rows.filter(row => row.id !== id)

            setRows(newRows)
            toast.success('Registro apagado com sucesso!')
        }
    }

    const handlePDF = async () => {
        const result = await ProductService.generatePdf(search, status, type, orientation, category, technique, dimension, productionDate, orderByPrice)

        if (result instanceof Error) {
            toast.error(result.message)
            return
        }

        // Manipula o buffer do PDF recebido
        const pdfBlob = new Blob([result], { type: 'application/pdf' })

        //Cria uma URL temporária para o blob do PDF
        const pdfUrl = URL.createObjectURL(pdfBlob)

        // Abre o PDF em outra janela
        window.open(pdfUrl, '_blank')

        //Limpa a URL temporária após abrir o PDF para liberar recursos
        URL.revokeObjectURL(pdfUrl)
    }

    return { handleDelete, handlePDF }
}

