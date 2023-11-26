import GameCard from "../components/GameCard";
import {Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Container from "react-bootstrap/Container";

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
            <Container className={"text-center"}>
                <Row xs={1}
                     md={2} lg={4}
                     className={""}>
                            {gameList.map(game => (
                                <GameCard key={game._id} gameId={game._id} gameList={gameList}/>
                            ))}
                </Row>
            </Container>
        </>
    );
}

export default GameCollection;