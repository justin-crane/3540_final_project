import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoImage from "./LogoImage";
import SearchBar from "./SearchBar";
import {Desktop, Tablet, Mobile, Minimum} from "./MediaSettings"

function NavigationBar(){
    const NavLinks = () => {
        return  <Nav className={"me-auto ps-3"}>
            <Nav.Link href={"/"}>Home</Nav.Link>
            <Nav.Link href={"/addgame"}>Add&nbsp;Game</Nav.Link>
            <Nav.Link href={"/user"}>Profile</Nav.Link>
            <Nav.Link href={"/games/random"}>Random</Nav.Link>
            <Nav.Link className={"pe-4"} href={"/login"}>Login</Nav.Link>
        </Nav>
    }
    return (
        <Navbar expand={"lg"} className={"bg-body-tertiary"}
                style={{marginLeft: "0px", marginRight: "0px", minHeight: "170px", zIndex: "2"}}>
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
                        <NavLinks/>
                    </Tablet>
                    <Mobile>
                        <NavLinks/>
                    </Mobile>
                    <Minimum>
                        <NavLinks/>
                    </Minimum>
                    <SearchBar />
                </Navbar.Collapse>

        </Navbar>
    )
}

export default NavigationBar;