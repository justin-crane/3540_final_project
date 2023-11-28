import {useMediaQuery} from "react-responsive";

export const Desktop = ({children}) => {
    const isDesktop = useMediaQuery({minWidth:992})
    return isDesktop ? children : null;
}
export const Tablet = ({children}) => {
    const isTablet = useMediaQuery({minWidth:768, maxWidth:991})
    return isTablet ? children : null;
}
export const Mobile = ({children}) => {
    const isMobile = useMediaQuery({maxWidth:767, minWidth: 638})
    return isMobile ? children : null;
}
export const Minimum = ({children}) => {
    const isMin = useMediaQuery({maxWidth:637})
    return isMin ? children : null;
}