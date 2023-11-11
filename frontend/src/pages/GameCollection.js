import GameProfileTeaser from "./GameProfile";
import GameCollectionTest from "../testData/GameCollectionTest";

const GameCollection = () => {

    return (
        <>
            <h1>Game Collection</h1>
            {GameCollectionTest.map(game => (
                <div key={game.name+game._id.id+game.notes}>
                    {console.log(game)}
                    <GameProfileTeaser args={game} />
                </div>
            ))}
        </>

    );
}

export default GameCollection;