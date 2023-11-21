import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

    const navigate = useNavigate();

    const onSignUpClicked = async () => {
        if (passwordValue !== confirmPasswordValue) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameValue,
                    email: emailValue,
                    password: passwordValue,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setErrorMessage(data.message || 'Failed to sign up');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            setErrorMessage('Failed to connect to the server');
        }
    };

    return (
        <div className="content-container">
            <h1>Sign Up</h1>
            {errorMessage && <div className="fail">{errorMessage}</div>}
            <input
                value={usernameValue}
                onChange={e => setUsernameValue(e.target.value)}
                placeholder="Username"/>
            <input
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                placeholder="Enter Your Email"/>
            <input
                type="password"
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                placeholder="Password"/>
            <input
                type="password"
                value={confirmPasswordValue}
                onChange={e => setConfirmPasswordValue(e.target.value)}
                placeholder="Confirm Password"/>
            <button
                disabled={
                    !usernameValue || !emailValue || !passwordValue ||
                    passwordValue !== confirmPasswordValue
                }
                onClick={onSignUpClicked}>Sign Up</button>
            <button onClick={() => navigate('/login')}>Already have an account? Log In!</button>
        </div>
    );
};
