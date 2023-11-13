import GameProfileTeaser from "./GameProfileTeaser";
import GameCollectionTest from "../testData/GameCollectionTest";
import Container from "react-bootstrap/Container";
import {Card, Col, Row} from "react-bootstrap";

const GameCollection = () => {

    return (
        <>
            <h1 className={"text-center"}>Game Collection</h1>
            <Container fluid>
                <Row className={"row justify-content-center"}>
                    {GameCollectionTest.map(game => (
                        <Col xs={10} md={5} lg={2}>
                            <div key={game.name+game._id.id+game.notes}>
                                <Card>
                                    <Card.Img variant={"top"} src={`/images/${game.img}`}/>
                                    <Card.Body>
                                        <Card.Title>{game.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>

    );
}

export default GameCollection;