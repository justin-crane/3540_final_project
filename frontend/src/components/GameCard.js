import '../App.css';
import {Card, Col, OverlayTrigger, Stack, Tooltip} from "react-bootstrap";
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
                    <Stack direction="horizontal" gap={2}
                           style={{
                               position: "fixed",
                               top: "2%",
                               left: "2%"
                           }}>
                        {game.forTrade === "true" || game.forTrade === true
                            ? <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip${game.name}`}>
                                        For Trade!
                                    </Tooltip>
                                }>
                                <Card.Img variant={"top"}
                                          src={"/images/for_trade_icon.png"}
                                          style={{
                                              width: "20%",
                                              filter: "drop-shadow(5px 5px 5px #00000055)"
                                          }}/>
                            </OverlayTrigger>

                            : <></>
                        }
                        {game.forSale === "true" || game.forSale === true
                            ? <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip${game.name}`}>
                                        For Sale!
                                    </Tooltip>
                                }>
                                <Card.Img variant={"top"}
                                          src={"/images/for_sale_icon.png"}
                                          style={{
                                              width: "20%",
                                              filter: "drop-shadow(5px 5px 5px #00000055)"
                                          }}/>
                            </OverlayTrigger>
                            : <></>
                        }
                    </Stack>
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