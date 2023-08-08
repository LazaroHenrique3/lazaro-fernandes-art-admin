import { createContext, useCallback, useContext, useState } from 'react'

interface INavBarOption {
    icon?: string
    path: string,
    label: string
}

interface INavBarContextData {
    anchorElNav: null | HTMLElement;
    anchorElUser: null | HTMLElement;
    pagesOptions: INavBarOption[];
    settingsOptions: INavBarOption[];
    setPagesOptions: (newNavBarOptions: INavBarOption[]) => void;
    setSettingsOptions: (newNavBarOptions: INavBarOption[]) => void;
    handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleCloseNavMenu: () => void;
    handleCloseUserMenu: () => void;
}

const NavBarContext = createContext({} as INavBarContextData)

export const useNavBarContext = () => {
    return useContext(NavBarContext)
}

interface IProviderProps {
    children: React.ReactNode
}

export const NavBarProvider: React.FC<IProviderProps> = ({ children }) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const [pagesOptions, setPagesOptions] = useState<INavBarOption[]>([])
    const [settingsOptions, setSettingsOptions] = useState<INavBarOption[]>([])

    const handleSetNavBarOptions = useCallback((newPageOptions: INavBarOption[]) => {
        setPagesOptions(newPageOptions)
    }, [])

    const handleSetNavBarSettings = useCallback((newSettingsOptions: INavBarOption[]) => {
        setSettingsOptions(newSettingsOptions)
    }, [])

    return (
        <NavBarContext.Provider value={{
            anchorElNav,
            anchorElUser,
            pagesOptions,
            settingsOptions,
            setPagesOptions: handleSetNavBarOptions,
            setSettingsOptions: handleSetNavBarSettings,
            handleOpenNavMenu,
            handleOpenUserMenu,
            handleCloseNavMenu,
            handleCloseUserMenu
        }}>
            {children}
        </NavBarContext.Provider>
    )
}


