import GameProfile from "./GameProfile";

const RandomGame = (args) => {

    const {randomGameId, gameList} = args;

    return (
        <>
            <GameProfile gameList={gameList} gameId={randomGameId}/>
        </>
    );
}

export default RandomGame;