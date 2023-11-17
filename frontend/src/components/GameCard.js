import '../App.css';
import {Card, Col} from "react-bootstrap";
import {Link} from 'react-router-dom';

const GameCard = (args) => {
    let {gameId, gameList} = args;

    const game = gameList.find(
        game => game._id === gameId)

    return (
        <Col key={game.name + game.notes + game.console}>
            <Link to={`/games/${gameId}`}>
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
                              src={game.img}
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
            </Link>
        </Col>
    );
}

export default GameCard;