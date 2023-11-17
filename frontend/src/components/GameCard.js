import '../App.css';
import {Card, Col} from "react-bootstrap";
import {Link} from 'react-router-dom';

const GameCard = (args) => {
    let {gameId, gameList} = args;

    const game = gameList.find(
        game => game._id === gameId)

    return (
        <Col
            key={game.name + game.notes + game.console}
            style={{
                margin: "0px",
                padding: "0px",
                border: "0px",
            }}
        >
            <Link
                to={`/games/${gameId}`}
                style={{ textDecoration: "none" }}
            >
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
                    {game.forTrade === "true" || game.forTrade === true
                        ? <Card.Text
                            style={{
                                position:"fixed",
                                top:"3%",
                                left:"3%",
                                color: "#FFFFFF",
                                background:"#d54d4d",
                                fontSize: "1.2rem",
                                padding: "0.3rem",
                                borderRadius: "15px",
                                userSelect: "none",
                                filter: "drop-shadow(5px 5px 5px #00000055)"
                            }}
                            >Trade ✔︎</Card.Text>
                        : <></>
                        }
                    {game.forSale === "true" || game.forSale === true
                        ? <Card.Text
                            style={{
                                position:"fixed",
                                top:"3%",
                                right:"3%",
                                color: "#3a3838",
                                background:"#ece781",
                                fontSize: "1.2rem",
                                padding: "0.3rem",
                                borderRadius: "15px",
                                userSelect: "none",
                                filter: "drop-shadow(5px 5px 5px #00000055)"
                            }}
                        >Sale ✔︎</Card.Text>
                        : <></>
                    }
                    <Card.Body style={{overflow:"scroll"}}>
                        <Card.Text>{game.name}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className={"text-muted"}>
                            Posted by: @{game.userInfo.username}
                        </small>
                    </Card.Footer>
                </Card>
            </Link>
        </Col>
    );
}

export default GameCard;