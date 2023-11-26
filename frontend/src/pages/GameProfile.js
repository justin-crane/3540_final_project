import {useParams} from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Image from "react-bootstrap/Image";
import {Card, Col, OverlayTrigger, Row, Stack, Tooltip} from "react-bootstrap";

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
        <Container>
            <Row className={"justify-content-md-center"}>
            <Col lg={"5"} md={"auto"} className={"mx-auto"}>
                <Image src={game.img} className={"h-75"} alt={game.name + " cover image."} fluid rounded/>
                <Stack direction="horizontal" gap={2}
                       style={{
                           position: "absolute",
                           top: "2%",
                           left: "3%"
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
                                          width: "15%",
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
                                          width: "15%",
                                          filter: "drop-shadow(5px 5px 5px #00000055)"
                                      }}/>
                        </OverlayTrigger>
                        : <></>
                    }
                </Stack>
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