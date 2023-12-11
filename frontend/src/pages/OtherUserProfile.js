import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Card, Col, ListGroup, Modal, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useParams} from "react-router-dom";
import MessengerPage from "./MessengerPage";


const OtherUserProfile = () => {
    const id = useParams().id;
    const [games, setGames] = useState([]);
    const [userData, setUserData] = useState([{userInfo:{username:"(Unknown Username)"}}]);  // State for user data
    const [loading, setLoading] = useState(true);    // State for loading indicator
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({ // State for form data
        name: '',
        gameConsole: '',
        img: '',
        condition: '',
        forTrade: false,
        forSale: false,
        price: '',
        notes: ''
    });

    // Function to fetch user data
    const fetchUserData = async (id) => {
        try {
            console.log(id);
            const response = await axios.get(`/api/user/`+ id, {
            });
            setUserData(response.data);
            console.log(response.data); // debug
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchGames = async (id) => {
        try {
            console.log('Fetching games...');
            const response = await axios.get(`/api/user/${id}`, {
            });
            console.log('Games fetched:', response.data);
            const processedGames = response.data.map(game => ({
                ...game,
                forTrade: game.forTrade,
                forSale: game.forSale
            }));
            console.log('Processed games:', processedGames);

            setGames(processedGames);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user games:', error);
            setLoading(false);
        }
    };

    const sendMessage = () => {

    }

    useEffect(() => {
        fetchGames(id);
        fetchUserData(id);

    }, []);

    const handleEdit = () => {
        handleShow();
    };


    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    return (

        <Container>
            <h2>Profile for: {userData[0].userInfo.username}</h2>
            <Button
                onClick={() => handleEdit()}>Send Message</Button>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Message {userData[0].userInfo.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MessengerPage recip={userData[0].userInfo.username} />
                </Modal.Body>
            </Modal>
            <h3>Your Games</h3>
            <Row style={{border: "1px solid #000000", borderRadius: "10px", padding: "10px"}}>
                {games.map(game => (
                    <Col key={game._id} className={"text-center"}
                         style={{display: "flex",
                             justifyContent: "center",
                             alignContent: "center",
                             margin: "30px"}}>
                        <Card border={"dark"}
                              style={{
                                  width: "300px", objectFit: "contain"}}>
                            <Card.Img variant="top"
                                      src={game.img}
                                      style={{objectFit: "cover", height: "150px"}} />
                            <Card.Header as="h4">{game.name}</Card.Header>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{fontSize: ".7rem"}}
                                                className={"text-muted pt-1"}>Added by: {game.userInfo.username}</ListGroup.Item>
                            </ListGroup>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{fontSize: ".7rem"}}>Price: ${game.price}</ListGroup.Item>
                            </ListGroup>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{fontSize: ".7rem"}}>Console: {game.gameConsole}</ListGroup.Item>
                            </ListGroup>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{fontSize: ".7rem"}}>Condition: {game.condition} / 5</ListGroup.Item>
                            </ListGroup>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{fontSize: ".7rem"}}>Date added: {game.dateAdded}</ListGroup.Item>
                            </ListGroup>
                            <ListGroup className="list-group-flush" style={{fontSize: ".7rem"}}>
                                {game.forTrade === "true" || game.forTrade === true
                                    ? <ListGroup.Item>For Trade? Yes</ListGroup.Item>
                                    : <ListGroup.Item>For Trade? No</ListGroup.Item>
                                }
                            </ListGroup>
                            <ListGroup className="list-group-flush" style={{fontSize: ".7rem"}}>
                                {game.forSale === "true" || game.forSale === true
                                    ? <ListGroup.Item>For Sale? Yes</ListGroup.Item>
                                    : <ListGroup.Item>For Sale? No</ListGroup.Item>
                                }
                            </ListGroup>
                            <Card.Footer className="text-muted" style={{fontSize: ".7rem"}}>
                                Notes: {game.notes}
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default OtherUserProfile;