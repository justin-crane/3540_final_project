import {useParams} from "react-router-dom";
import GameCollectionTest from "../testData/GameCollectionTest";
import Container from 'react-bootstrap/Container'
import Image from "react-bootstrap/Image";
import {Col, Row} from "react-bootstrap";
const GameProfileTeaser = (args) => {
    let gameId = args.gameId;

    const game = GameCollectionTest.find(
        game=> game._id.id === gameId._id.id)

    return (
        <Container>
                <Image src={"/images/" + game.img}
                       key={game.name+game.console+game.notes}
                       className={"h-75"}
                       alt={game.name + " cover image."}
                       fluid rounded/>
                <p>{game.name}</p>
        </Container>
    );
}

export default GameProfileTeaser;