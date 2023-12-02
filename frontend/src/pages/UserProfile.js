import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditGameForm } from './EditGameForm';


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
        <div>
            <h2>Your Profile</h2>
            {/* Display user data here */}
            <h3>Your Games</h3>
            <ul>
                {games.map(game => (
                    <li key={game._id} style={{ marginBottom: '20px' }}>
                        <img src={game.img} alt={`Cover of ${game.name}`} style={{ width: '100px', height: 'auto' }} />
                        <strong>{game.name}</strong>
                        <div>Console: {game.gameConsole}</div>
                        <div>Condition: {game.condition}</div>
                        <div>For Trade: {game.forTrade ? 'Yes' : 'No'}</div>
                        <div>For Sale: {game.forSale ? 'Yes' : 'No'}</div>
                        <div>Price: ${game.price}</div>
                        <div>Notes: {game.notes}</div>
                        {/* Edit and delete buttons */}
                        <button onClick={() => handleEdit(game)}>Edit</button>
                        <button onClick={() => handleDelete(game._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* Conditional rendering for editing a game */}
            {editingGame && (
                <EditGameForm
                    game={editingGame}
                    handleUpdate={handleUpdate}
                    cancelEdit={cancelEdit}
                />
            )}
        </div>
    );
};

export default UserProfile;
