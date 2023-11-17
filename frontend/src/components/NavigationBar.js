import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoImage from "./LogoImage";

function NavigationBar(){
    // code

    return (
        <Navbar expand={"lg"} className={"bg-body-tertiary"}>
            <Container>
                <Navbar.Brand href={"/"}>
                    <LogoImage/>
                    Video Game Trade Centre</Navbar.Brand>
                <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
                <Navbar.Collapse id={"basic-navbar-nav"}>
                    <Nav className={"me-auto"}>
                    <Nav.Link href={"/"}>Home</Nav.Link>
                    <Nav.Link href={"/addgame"}>Add Game</Nav.Link>
                    <Nav.Link href={"/games"}>Game Collections</Nav.Link>
                    <Nav.Link href={"/user"}>Profile</Nav.Link>
                    <Nav.Link href={"games/random/:randomId"}>Random</Nav.Link>
                    <Nav.Link href={"/login"}>Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar;