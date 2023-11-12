import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const LogInPage = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const [googleURL, setGoogleURL] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3001/api/google/oauthURL")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => setGoogleURL(data.url))
            .catch(e => {
                console.error("Error fetching Google OAuth URL:", e);
                setErrorMessage("Failed to fetch Google OAuth URL");
            });
    }, []);

    const onGoogleLoginClicked = () => {
        window.location.href = googleURL;
    };

    const onLogInClicked = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: emailValue, password: passwordValue }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/games'); // navigate to the game collection page or any protected route
            } else {
                setErrorMessage(data.message || 'Failed to login');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server');
        }
    };

    const onLogOutClicked = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        // Redirect to different page
        navigate('/'); // navigate to home page?
    };

    return (
        <div className="content-container">
            <h1>Log In</h1>
            {errorMessage && <div className="fail">{errorMessage}</div>}
            <input
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                placeholder="Enter Your Email"/>
            <input
                type="password"
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                placeholder="password"/>
            <button
                disabled={!emailValue || !passwordValue}
                onClick={onLogInClicked}>Log In</button>
            <button
                disabled={!googleURL}
                onClick={onGoogleLoginClicked}>Log In with Google</button>
            <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
            <button onClick={() => navigate('/signup')}>Don't have an account? Sign Up!</button>
            <button onClick={onLogOutClicked}>Log Out</button>
        </div>
    );
};
