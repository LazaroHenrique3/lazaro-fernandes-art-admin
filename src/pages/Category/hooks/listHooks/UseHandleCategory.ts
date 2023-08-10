import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CategoryService, IListCategory } from '../../../../shared/services/api/category/CategoryService'

interface IUseHandleCategoryProps {
    setRows: (categorys: IListCategory[]) => void
    rows:  IListCategory[]
    search: string
}

export const UseHandleCategory = ({ setRows, rows, search }: IUseHandleCategoryProps) => {

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CategoryService.deleteById(id)

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
        const result = await CategoryService.generatePdf(search)

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

