import GameCard from "../components/GameCard";
import {Row} from "react-bootstrap";

const GameCollection = (args) => {

    let {gameList, setGameList} = args;

    return (
        <>
            <h1 className={"text-center"}>Game Collection</h1>
            <Row xs={1}
                 md={2} lg={4}
                 className={"align-items-center justify-content-center text-center"}>
                        {gameList.map(game => (
                            <GameCard gameId={game._id} gameList={gameList}/>
                        ))}
            </Row>
        </>

    );
}

export default GameCollection;