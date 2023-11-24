import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogInPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [googleURL, setGoogleURL] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State for tracking login status

    const navigate = useNavigate();

    useEffect(() => {
        // Function to check login status
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token); // Update login status based on token
        };

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            console.log('Token set in localStorage:', token); //debugging
            setIsLoggedIn(true);
            navigate('/games');
        }

        // Call this function on component mount and whenever the token changes
        checkLoginStatus();

        // Fetch Google OAuth URL
        fetch("http://localhost:3001/api/google/oauthURL")
            .then(response => response.json())
            .then(data => setGoogleURL(data.url))
            .catch(e => {
                console.error("Error fetching Google OAuth URL:", e);
                setErrorMessage("Failed to fetch Google OAuth URL");
            });
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, [navigate]);

    const onGoogleLoginClicked = () => {
        window.location.href = googleURL;
    };

    const onLogInClicked = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailValue, password: passwordValue }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true); // Update login status
                navigate('/games'); // navigate to the game collection page or any protected route
            } else {
                setErrorMessage(data.message || 'Failed to login');
            }
        } catch (error) {
            setErrorMessage('Failed to connect to the server');
        }
    };

    const onLogOutClicked = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Update login status
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
                placeholder="Password"/>
            <button
                disabled={!emailValue || !passwordValue || isLoggedIn} // Disable if fields are empty or user is logged in
                onClick={onLogInClicked}>Log In</button>
            <button
                disabled={!googleURL || isLoggedIn} // Disable if Google URL is not fetched or user is logged in
                onClick={onGoogleLoginClicked}>Log In with Google</button>
            <button onClick={() => navigate('/signup')}>Don't have an account? Sign Up!</button>
            <button
                onClick={onLogOutClicked}
                disabled={!isLoggedIn}>Log Out</button> {/* Disable if not logged in */}
        </div>
    );
};
