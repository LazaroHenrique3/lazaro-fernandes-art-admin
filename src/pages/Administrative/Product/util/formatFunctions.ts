export const formattedPrice = (value: number | string) => {

    if (typeof value === 'string') return ''

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}