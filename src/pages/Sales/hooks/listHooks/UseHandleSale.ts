import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
    SaleService,
    ISaleListAll,
    TSaleStatus
} from '../../../../shared/services/api/sales/SaleService'

interface IUseHandleSaleProps {
    setRows: (sales: ISaleListAll[]) => void
    rows: ISaleListAll[]
    search: string
}

export const UseHandleSale = ({ setRows, rows, search }: IUseHandleSaleProps) => {

    const handleCancelSale = async (idSale: number, idUser: number) => {

        if (confirm('Realmente deseja cancelar esse pedido?')) {
            const result = await SaleService.cancelSale(idUser, idSale)

            if (result instanceof Error) {
                toast.error(result.message)
                return
            }

            //Criar um novo array com o status atualizado
            const newRows = rows.map(row => {
                if (row.id === idSale) {
                    // Se o ID corresponder, atualize o status para "cancelada"
                    const newStatus: TSaleStatus = 'Cancelada'
                    return { ...row, status: newStatus }
                }
                return row
            })

            setRows(newRows)
            toast.success('Pedido cancelado com sucesso!')
        }
    }

    const handlePDF = async () => {
        const result = await SaleService.generatePdf(search)

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

    return { handleCancelSale, handlePDF }
}

