import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'
import { TMonthsWithFullBilling } from '../../services/api/sales/SaleService'
import { capitalizeFirstLetter } from '../../util'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'últimos 12 meses',
        },
    },
}

interface IBarChartProps {
    dataChart: TMonthsWithFullBilling[]
}

export const BarChart: React.FC<IBarChartProps> = ({ dataChart }) => {
    const labels: string[] = []
    const monthBilling: number[] = []

    //Adcionando o label dos names e as datas(dados)
    dataChart.map((data) => {
        labels.push(capitalizeFirstLetter(data.monthName))
        monthBilling.push(data.total)
    })

    const data = {
        labels,
        datasets: [{
            label: 'R$',
            data: monthBilling,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(0, 128, 0, 0.2)',
                'rgba(255, 140, 0, 0.2)',
                'rgba(70, 130, 180, 0.2)',
                'rgba(255, 20, 147, 0.2)',
                'rgba(0, 255, 255, 0.2)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(0, 128, 0)',
                'rgb(255, 140, 0)',
                'rgb(70, 130, 180)',
                'rgb(255, 20, 147)',
                'rgb(0, 255, 255)',
            ],
            borderWidth: 1
        }]
    }

    return <Bar options={options} data={data} />
}
