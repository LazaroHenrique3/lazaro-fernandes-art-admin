import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CustomerService, IListCustomer } from '../../../../shared/services/api/customer/CustomerService'

interface IUseHandleCustomer {
    setRows: (customers: IListCustomer[]) => void
    rows:  IListCustomer[]
    search: string
    status: string
    genre:  string
    dateOfBirth: string
}

export const UseHandleCustomer = ({ setRows, rows, search, status, genre, dateOfBirth }: IUseHandleCustomer) => {

    const handleDelete = async (id: number, name: string) => {

        if (confirm(`Realmente deseja apagar "${name}"?`)) {
            const result = await CustomerService.deleteById(id)

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
        const result = await CustomerService.generatePdf(search, status, genre, dateOfBirth)

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

