import {useParams} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Image from "react-bootstrap/Image";
import {Col, Row} from "react-bootstrap";

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
            </Col>
            <Col lg={"5"} md={"auto"}>
                <h1>{game.name}</h1>
                <h2>Console: {game.gameConsole}</h2>
                <h3>Condition: {game.condition}</h3>
                <h3>Added by: {game.userInfo.username}</h3>
                <h3>Date added: {game.dateAdded}</h3>
                <h3>Price: {game.price}</h3>
                <h4>For trade?: {game.forTrade}</h4>
                <h4>For sale?: {game.forSale}</h4>
                <p>Notes: {game.notes}</p>
            </Col>
            </Row>
        </Container>
    );
}

export default GameProfile;