import React, { useEffect } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import GameProfileTeaser from "./GameProfile";
import GameCollectionTest from "../testData/GameCollectionTest";

const GameCollection = () => {
    // Check for token in local storage
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // If there's no token, redirect to login
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    // If there's a token, render GameCollection
    return (
        <>
            <h1>Game Collection</h1>
            {GameCollectionTest.map(game => (
                <div key={game.name+game._id.id+game.notes}>
                    {console.log(game)}
                    <GameProfileTeaser args={game} />
                </div>
            ))}
        </>

    );
}

export default GameCollection;