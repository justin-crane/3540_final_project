import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoImage from "./LogoImage";
import SearchBar from "./SearchBar";
import {useMediaQuery} from "react-responsive";

function NavigationBar(){

    const Desktop = ({children}) => {
        const isDesktop = useMediaQuery({minWidth:992})
        return isDesktop ? children : null;
    }
    const Tablet = ({children}) => {
        const isTablet = useMediaQuery({minWidth:768, maxWidth:991})
        return isTablet ? children : null;
    }
    const Mobile = ({children}) => {
        const isMobile = useMediaQuery({maxWidth:767, minWidth: 638})
        return isMobile ? children : null;
    }
    const Minimum = ({children}) => {
        const isMin = useMediaQuery({maxWidth:637})
        return isMin ? children : null;
    }

    return (
        <Navbar expand={"lg"} className={"bg-body-tertiary"}
                style={{marginLeft: "0px", marginRight: "0px"}}>
                <Navbar.Brand href={"/"} className={"pl-4"}>
                    <LogoImage/>
                    Video Game Trade Centre
                </Navbar.Brand>
                <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
                <Navbar.Collapse id={"basic-navbar-nav"} >
                    <Desktop>
                        <Nav className={"me-auto"}>
                            <Nav.Link href={"/"}>Home</Nav.Link>
                            <Nav.Link href={"/addgame"}>Add&nbsp;Game</Nav.Link>
                            <Nav.Link href={"/user"}>Profile</Nav.Link>
                            <Nav.Link href={"/games/random"}>Random</Nav.Link>
                            <Nav.Link className={"pe-4"} href={"/login"}>Login</Nav.Link>
                        </Nav>
                    </Desktop>
                    <Tablet>
                        <Nav className={"me-auto ps-3"}>
                            <Nav.Link href={"/"}>Home</Nav.Link>
                            <Nav.Link href={"/addgame"}>Add&nbsp;Game</Nav.Link>
                            <Nav.Link href={"/user"}>Profile</Nav.Link>
                            <Nav.Link href={"/games/random"}>Random</Nav.Link>
                            <Nav.Link className={"pe-4"} href={"/login"}>Login</Nav.Link>
                        </Nav>
                    </Tablet>
                    <Mobile><Nav className={"me-auto ps-3"}>
                        <Nav.Link href={"/"}>Home</Nav.Link>
                        <Nav.Link href={"/addgame"}>Add&nbsp;Game</Nav.Link>
                        <Nav.Link href={"/user"}>Profile</Nav.Link>
                        <Nav.Link href={"/games/random"}>Random</Nav.Link>
                        <Nav.Link className={"pe-4"} href={"/login"}>Login</Nav.Link>
                    </Nav></Mobile>
                    <Minimum><Nav className={"me-auto ps-3"}>
                        <Nav.Link href={"/"}>Home</Nav.Link>
                        <Nav.Link href={"/addgame"}>Add&nbsp;Game</Nav.Link>
                        <Nav.Link href={"/user"}>Profile</Nav.Link>
                        <Nav.Link href={"/games/random"}>Random</Nav.Link>
                        <Nav.Link className={"pe-4"} href={"/login"}>Login</Nav.Link>
                    </Nav></Minimum>
                    <SearchBar />
                </Navbar.Collapse>

        </Navbar>
    )
}

export default NavigationBar;