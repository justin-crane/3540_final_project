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
        <Container style={{display: "flex"}} className={"pt-5 text-center"}>
            <Row className={""}>
            <Col lg={"5"} md={"auto"} className={"mx-auto"}>
                <Image src={game.img} className={"h-75 min-vw-1"} alt={game.name + " cover image."} fluid rounded/>
                <Stack
                       direction="horizontal" gap={2}
                       style={{
                           position: "absolute",
                           top: "1%",
                           left: "15%"
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
                                          width: "13%",
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
                                          width: "13%",
                                          filter: "drop-shadow(5px 5px 5px #00000055)"
                                      }}/>
                        </OverlayTrigger>
                        : <></>
                    }
                </Stack>
            </Col>
            <Col className={"text-center"} lg={"5"} md={"auto"}>
                <Card border={"dark"}>
                    <Card.Header as="h1">{game.name}</Card.Header>
                    <Card.Body>
                        <Card.Title className={"text-muted h6 pt-1"}>Added by: {game.userInfo.username}</Card.Title>
                    </Card.Body>
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
                    <Card.Footer className="text-muted">Notes: {game.notes}</Card.Footer>
                </Card>
            </Col>
            </Row>
        </Container>
    );
}

export default GameProfile;