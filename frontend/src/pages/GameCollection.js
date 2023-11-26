import GameCard from "../components/GameCard";
import {Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const GameCollection = (args) => {

    let {gameList, setGameList} = args;
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/user'); // Redirect to the profile page
        }
    }, [navigate]);

    return (
        <>
            <h1 className={"text-center pt-3 text-decoration-underline"}>Recent Additions</h1>
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