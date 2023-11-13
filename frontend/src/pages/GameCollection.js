import GameCard from "./GameCard";
import GameCollectionTest from "../testData/GameCollectionTest";
import {CardGroup, Row} from "react-bootstrap";

const GameCollection = () => {

    return (
        <>
            <h1 className={"text-center"}>Game Collection</h1>
            {/*<CardGroup className={"justify-content-center"}>*/}
            <Row xs={1}
                 md={2} lg={4}
                 className={"justify-content-center text-center"}>
                        {GameCollectionTest.map((game, idx) => (
                            <GameCard gameId={game._id.id} idx={idx} />
                        ))}
            </Row>
            {/*</CardGroup>*/}
        </>

    );
}

export default GameCollection;