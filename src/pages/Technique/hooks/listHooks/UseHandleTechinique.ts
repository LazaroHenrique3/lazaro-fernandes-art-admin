import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TechniqueService, IListTechnique } from '../../../../shared/services/api/technique/TechniqueService'

interface IUseHandleTechniqueProps {
    setRows: (techniques: IListTechnique[]) => void
    rows: IListTechnique[]
    search: string
    status: string
}

export const UseHandleTechnique = ({ setRows, rows, search, status }: IUseHandleTechniqueProps) => {

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await TechniqueService.deleteById(id)

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
        const result = await TechniqueService.generatePdf(search, status)

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

