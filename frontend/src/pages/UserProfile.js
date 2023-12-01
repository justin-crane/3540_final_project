import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddGame } from './AddGame';
import {Button, Card, Col, ListGroup, Row} from "react-bootstrap";
import GameCard from "../components/GameCard";
import Container from "react-bootstrap/Container";


const UserProfile = () => {
    const [games, setGames] = useState([]);
    const [userData, setUserData] = useState(null);  // State for user data
    const [loading, setLoading] = useState(true);    // State for loading indicator
    const [editingGame, setEditingGame] = useState(null); // State to track which game is being edited
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
            setUserData(await response.data);
            console.log("Response data:", await response.data); // debug
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };


    // Function to fetch games of the logged-in user
    const fetchGames = async (token) => {
        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Raw Games Data: ", await response.data);
            const processedGames = response.data.map(game => ({
                ...game,
                forTrade: game.forTrade === 'true' || game.forTrade === true, // Convert string "true" or boolean true to boolean
                forSale: game.forSale === 'true' || game.forSale === true // Convert string "true" or boolean true to boolean
            }));
            setGames(processedGames); // Update the state with the processed games
        } catch (error) {
            console.error('Error fetching user games', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            setLoading(false);
            fetchUserData(token);
            return;
        }

        const fetchGames = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:3001/api/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGames(response.data);
                console.log("Response data:", await response.data); // debug
            } catch (error) {
                console.error('Error fetching user games', error);
            }
            setLoading(false);
        };

        // Call fetchGames every time the UserProfile component is mounted or gains focus
        fetchGames();
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

    // Function to handle editing a game
    const handleEdit = (game) => {
        console.log("Editing game ID:", game._id);
        setEditingGame(game._id); // Set editing game id
        setFormData(game); // Set form data
    };

    // Function to handle form input changes
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data
    };

    // Function to handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form, EditingGame ID:", editingGame);
        const token = localStorage.getItem('token');
        const url = editingGame ? `/api/modifygame/${editingGame}` : '/api/addgame/';
        const method = editingGame ? 'put' : 'post';

        try {
            await axios[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchGames(token); // Refresh games list
            setEditingGame(null); // Reset editing state
            setFormData({ name: '', gameConsole: '', img: '', condition: '', forTrade: false, forSale: false, price: '', notes: '' }); // Reset form data
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    // Render user profile
    return (
        <Container>
            <h2>Your Profile</h2>
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
                            </Card>
                        </Col>
                    // <li key={game._id} style={{ marginBottom: '20px' }}>
                    //     <img src={game.img} alt={`Cover of ${game.name}`} style={{ width: '100px', height: 'auto' }} />
                    //     <strong>{game.name}</strong>
                    //     <div>Console: {game.gameConsole}</div>
                    //     <div>Condition: {game.condition}</div>
                    //     <div>For Trade: {game.forTrade ? 'Yes' : 'No'}</div>
                    //     <div>For Sale: {game.forSale ? 'Yes' : 'No'}</div>
                    //     <div>Price: ${game.price}</div>
                    //     <div>Notes: {game.notes}</div>
                    //     {/* Edit and delete buttons */}

                    // </li>
                ))}
            </Row>
            {/* Conditional rendering for editing a game */}
            {editingGame && (
                <AddGame
                    game={formData}
                    setEditingGame={setEditingGame}
                    fetchGames={fetchGames}
                    isEditing={true}
                />
            )}
        </Container>
    );
};

export default UserProfile;
