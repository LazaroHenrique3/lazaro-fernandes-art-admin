import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ITrackOrderResponse, ShippingService } from '../../../../services/api/shipping/ShippingService'

interface IUseFetchTrackOrderDataProps {
    setIsLoading: (status: boolean) => void
    setTrackOrderData: (trackOrderData: ITrackOrderResponse[]) => void
    handleClose: () => void
}

export const UseFetchTrackOrderData = ({ setIsLoading, setTrackOrderData, handleClose }: IUseFetchTrackOrderDataProps) => {

    const fetchTrackOrderData = async (trackingCode: string) => {
        setIsLoading(true)
        const result = await ShippingService.trackOrder(trackingCode)

        setIsLoading(false)

        if (result instanceof Error) {
            toast.error(result.message)
            handleClose()
            return
        }

        setTrackOrderData(result)
    }

    return { fetchTrackOrderData }
}


