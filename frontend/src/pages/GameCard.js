import '../App.css';
import GameCollectionTest from "../testData/GameCollectionTest";
import {Card, Col} from "react-bootstrap";
const GameCard = (args) => {
    let gameId = args.gameId;
    let idx = args.idx;
    const game = GameCollectionTest.find(
        game=> game._id.id === gameId)

    return (
        <Col key={idx}>
            <a href={`/games/${gameId}`} style={{textDecoration:"none"}}>
                <Card
                    className={"hvr-grow-shadow"}
                    border={"dark"}
                    style={{
                        cursor:"pointer",
                        aspectRatio:"0.6",
                        margin:"30px",
                        height:"450px",
                        maxWidth:"300px",}}
                      key={game.name+game._id.id+game.notes}>
                    <Card.Img variant={"top"}
                              src={`/images/${game.img}`}
                              style={{
                                  minHeight:"70%",
                                  maxHeight:"400px" }}/>
                    <Card.Body style={{overflow:"scroll"}}>
                        <Card.Text>{game.name}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className={"text-muted"}>Posted by: @username</small>
                    </Card.Footer>
                </Card>
            </a>
        </Col>
    );
}

export default GameCard;