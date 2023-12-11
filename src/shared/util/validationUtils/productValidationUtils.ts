//Número máximo de imagens para upload
export const MAX_PRODUCT_IMAGES = 4

//Tamanhos recomendados em pixels
export const PRODUCT_IMAGE = {
    MIN_H_MAIN_IMAGE: 1070,
    MAX_H_MAIN_IMAGE: 1090,
    MIN_W_MAIN_IMAGE: 705,
    MAX_W_MAIN_IMAGE: 725,
    MIN_H_PRODUCT_IMAGES: 720,
    MAX_H_PRODUCT_IMAGES: 740,
    MIN_W_PRODUCT_IMAGES: 690,
    MAX_W_PRODUCT_IMAGES: 710
}

//Verifica se as dimensões estão dentro do esperado, utilizado no cadastro de Produto
export const isValidDimensions = (maxWidth: number, maxHeight: number, minWidth: number, minHeight: number, imageHeight: number, imageWidth: number): boolean => {
    return (imageHeight >= minHeight && imageHeight <= maxHeight) && (imageWidth >= minWidth && imageWidth <= maxWidth)
}