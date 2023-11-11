import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navbar(){
    // code

    return (
        <Navbar expand={"lg"} className={"bg-body-tertiary"}>
            <Container>
                <Navbar.Brand href={"#home"}>Video Game Trade Centre</Navbar.Brand>
                <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
                <Navbar.Collapse id={"basic-navbar-nav"}>
                    <Nav.Link href={"#home"}>Home</Nav.Link>
                    <Nav.Link href={"#addgame"}>Add Game</Nav.Link>
                    <Nav.Link href={"#profile"}>Profile</Nav.Link>
                    <Nav.Link href={"#random"}>Random</Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

