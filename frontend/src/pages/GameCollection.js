import GameCard from "../components/GameCard";
import {Col, Row} from "react-bootstrap";
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
                <Row
                     style={{display: "flex", justifyContent: "center", alignContent: "center", margin: "30px"}}>
                    {gameList.map(game => (
                        <Col>
                            <GameCard key={game._id} gameId={game._id} gameList={gameList}/>
                        </Col>
                            ))}
                </Row>
        </>
    );
}

export default GameCollection;