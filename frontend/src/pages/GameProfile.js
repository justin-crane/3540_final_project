import {useParams} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Image from "react-bootstrap/Image";
import {Card, Col, Row} from "react-bootstrap";

const GameProfile = (args) => {
    const {gameList} = args;
    const {gameId} = useParams();

    const game = gameList.find(
        game => game._id === gameId)

    return (
        <Container>
            <Row className={"justify-content-md-center"}>
            <Col lg={"5"} md={"auto"} className={"mx-auto"}>
                <Image src={game.img} className={"h-75"} alt={game.name + " cover image."} fluid rounded/>
                {game.forTrade === "true" || game.forTrade === true
                    ? <Card.Text
                        style={{
                            position:"absolute",
                            top:"3%",
                            left:"3%",
                            color: "#FFFFFF",
                            background:"#d54d4d",
                            fontSize: "1.2rem",
                            padding: "0.3rem",
                            borderRadius: "15px",
                            cursor: "default",
                            userSelect: "none",
                            filter: "drop-shadow(5px 5px 5px #00000055)"
                        }}
                    >Trade ✔︎</Card.Text>
                    : <></>
                }
                {game.forSale === "true" || game.forSale === true
                    ? <Card.Text
                        style={{
                            position:"absolute",
                            top:"3%",
                            right:"30%",
                            color: "#3a3838",
                            background:"#ece781",
                            fontSize: "1.2rem",
                            padding: "0.3rem",
                            borderRadius: "15px",
                            cursor: "default",
                            userSelect: "none",
                            filter: "drop-shadow(5px 5px 5px #00000055)"
                        }}
                    >Sale ✔︎</Card.Text>
                    : <></>
                }
            </Col>
            <Col lg={"5"} md={"auto"}>
                <h1>{game.name}</h1>
                <h2>Console: {game.gameConsole}</h2>
                <h3>Condition: {game.condition}</h3>
                <h3>Added by: {game.userInfo.username}</h3>
                <h3>Date added: {game.dateAdded}</h3>
                <h3>Price: ${game.price}</h3>
                {game.forTrade === "true" || game.forTrade === true
                    ? <h4>For Trade? Yes </h4>
                    : <h4>For Trade? No</h4>
                }
                {game.forSale === "true" || game.forSale === true
                    ? <h4>For Sale? Yes </h4>
                    : <h4>For Sale? No</h4>
                }
                <p>Notes: {game.notes}</p>
            </Col>
            </Row>
        </Container>
    );
}

export default GameProfile;