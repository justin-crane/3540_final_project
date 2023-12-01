import {useParams} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Image from "react-bootstrap/Image";
import {Card, Col, ListGroup, OverlayTrigger, Row, Stack, Tooltip} from "react-bootstrap";

/*
*
*   TODO: - Display the return information of this game in a better layout.
*
* */

const GameProfile = (args) => {
    const {gameList} = args;
    let {gameId} = useParams();
    if (!gameId){
        gameId = args.gameId;
    }

    const game = gameList.find(
        game => game._id === gameId)

    return (
            <Row>
                <Col style={{display: "flex", justifyContent: "center", alignContent: "center", margin: "30px"}}>
                    <Image
                        src={game.img}
                        style={{width: "400px", minWidth: "400px", objectFit: "contain"}}
                        alt={game.name + " cover image."}
                        fluid rounded/>
                    <Stack
                           direction="horizontal" gap={2}
                           style={{
                               position: "absolute",
                               top: "2%",
                               paddingRight: "250px"
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
                                              width: "60px",
                                              minWidth: "60px",
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
                                              width: "60px",
                                              minWidth: "60px",
                                              filter: "drop-shadow(5px 5px 5px #00000055)"
                                          }}/>
                            </OverlayTrigger>
                            : <></>
                        }
                    </Stack>
                </Col >
                <Col className={"text-center"}
                     style={{display: "flex", justifyContent: "center", alignContent: "center", margin: "30px"}}>
                    <Card border={"dark"} style={{width: "400px"}}>
                        <Card.Img variant="top"
                                  src={game.img}
                                  style={{objectFit: "cover", height: "50px"}} />
                        <Card.Header as="h1"
                            style={{paddingTop: "20px", paddingBottom: "20px"}}
                        >{game.name}</Card.Header>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item
                                className={"text-muted h6 pt-1"}>Added by: {game.userInfo.username}</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Price: ${game.price}</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Console: {game.gameConsole}</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Condition: {game.condition}</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Date added: {game.dateAdded}</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            {game.forTrade === "true" || game.forTrade === true
                                ? <ListGroup.Item>For Trade? Yes</ListGroup.Item>
                                : <ListGroup.Item>For Trade? No</ListGroup.Item>
                            }
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            {game.forSale === "true" || game.forSale === true
                                ? <ListGroup.Item>For Sale? Yes</ListGroup.Item>
                                : <ListGroup.Item>For Sale? No</ListGroup.Item>
                            }
                        </ListGroup>
                        <Card.Footer className="text-muted h-50">Notes: {game.notes}</Card.Footer>
                    </Card>
                </Col>
            </Row>
    );
}

export default GameProfile;