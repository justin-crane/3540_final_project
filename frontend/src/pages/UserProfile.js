import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddGame } from './AddGame';


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


    // Function to fetch games of the logged-in user
    const fetchGames = async (token) => {
        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGames(response.data); // Set games data
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
                        <button onClick={() => handleDelete(game._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {/* Conditional rendering for editing a game */}
            {editingGame && (
                <AddGame
                    game={formData}
                    setEditingGame={setEditingGame}
                    fetchGames={fetchGames}
                    isEditing={true}
                />
            )}
        </div>
    );
};

export default UserProfile;
