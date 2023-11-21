import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [games, setGames] = useState([]);
    const [userData, setUserData] = useState(null);  // Declare userData state
    const [loading, setLoading] = useState(true);
    const [editingGame, setEditingGame] = useState(null);
    const [formData, setFormData] = useState({
        name: '', gameConsole: '', img: '', condition: '', availability: '', notes: ''
    });

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const fetchGames = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.get(`/api/usergames`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGames(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchGames();
    }, []);


    const handleDelete = async (gameId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/deletegame/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGames(games.filter(game => game._id !== gameId));
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleEdit = (game) => {
        setEditingGame(game._id);
        setFormData({ ...game });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingGame ? `/api/modifygame/${editingGame}` : '/api/addgame/';
        const method = editingGame ? 'put' : 'post';

        try {
            await axios[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchGames(); // Refresh games list
            setEditingGame(null); // Reset editing state
            setFormData({ name: '', gameConsole: '', img: '', condition: '', availability: '', notes: '' }); // Reset form data
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    if (loading) {
        return <div>Please Log In To View Your User Profile</div>;
    }

    return (
        <div>
            <h2>Your Profile</h2>
            {/* Profile information will go here */}

            <h3>Your Games</h3>
            <ul>
                {games.map(game => (
                    <li key={game._id}>
                        {game.name}
                        <button onClick={() => handleEdit(game)}>Edit</button>
                        <button onClick={() => handleDelete(game._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>{editingGame ? 'Edit Game' : 'Add a Game'}</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} />
                {/* ... other form fields for gameConsole, img, condition, availability, notes ... */}
                <button type="submit">{editingGame ? 'Update Game' : 'Add Game'}</button>
            </form>
        </div>
    );
};

export default UserProfile;
