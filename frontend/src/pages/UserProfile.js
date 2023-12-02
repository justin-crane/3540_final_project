import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Card, Col, ListGroup, Modal, Row} from "react-bootstrap";
import { EditGameForm } from './EditGameForm';
import Container from "react-bootstrap/Container";

const UserProfile = () => {
    const [games, setGames] = useState([]);
    const [userData, setUserData] = useState([{userInfo:{username:"(Unknown Username)"}}]);  // State for user data
    const [loading, setLoading] = useState(true);    // State for loading indicator
    const [editingGame, setEditingGame] = useState(null); // State to track which game is being edited
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
    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
            console.log(response.data); // debug
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchGames = async (token) => {
        try {
            console.log('Fetching games...');
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchGames(token);
            fetchUserData(token);
        } else {
            console.error('No token found');
            setLoading(false);
        }
    }, []);
    // Function to handle deleting a game
    const handleDelete = async (gameId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/deletegame/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGames(games.filter(game => game._id !== gameId)); // Update state
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    // Function to handle edit button click
    const handleEdit = (game) => {
        handleShow();
        setEditingGame(game); // Set the game to be edited
    };

    // Function to handle update submission
    const handleUpdate = async (updatedGame) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/api/modifygame/${updatedGame._id}`, updatedGame, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                const updatedGames = games.map(game =>
                    game._id === updatedGame._id ? { ...game, ...updatedGame } : game
                );
                setGames(updatedGames);
                setEditingGame(null);
            }
        } catch (error) {
            console.error('Error updating game:', error);
        }
        handleClose();
    };

    // Function to cancel editing
    const cancelEdit = () => {
        setEditingGame(null);
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    // Render user profile
    return (

        <Container>
            <h2>Profile for: {userData[0].userInfo.username}</h2>
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
                            <Button
                                style={{position: "absolute", top: "10px", left: "220px"}}
                                onClick={() => handleDelete(game._id)}>Delete</Button>
                            <Button
                                variant={"warning"}
                                style={{position: "absolute", top: "53px", left: "238px"}}
                                onClick={() => handleEdit(game)}>Edit</Button>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Conditional rendering for editing a game */}
            {editingGame && (
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {editingGame.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditGameForm
                            game={editingGame}
                            handleUpdate={handleUpdate}
                            cancelEdit={cancelEdit}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default UserProfile;
