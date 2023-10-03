/* import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Doughnut } from 'react-chartjs-2'



ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

export const CategoriesChart = (labels: string[], dataChart: number[]) => {

    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }

    return (
        <Doughnut
            data={data}
        />
    )
} */

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Doughnut } from 'react-chartjs-2'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

import { TTopCategories } from '../../services/api/sales/SaleService'

interface ICategoriesChartProps {
    dataChart: TTopCategories[]
}

export const CategoriesChart: React.FC<ICategoriesChartProps> = ({ dataChart }) => {

    const labelsCategory = dataChart.map((category) => category.name)
    const dataCategory = dataChart.map((category) => category.total_sales)
    const data = {
        labels: labelsCategory,
        datasets: [{
            label: 'Categorias mais vendidas',
            data: dataCategory,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }

    return (
        <Doughnut
            data={data}
        />
    )
}