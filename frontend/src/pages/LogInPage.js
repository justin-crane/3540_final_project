import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LogInPage = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const navigate = useNavigate();

    const onLogInClicked = async () => {
        alert('Login not implemented yet');
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
            <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
            <button onClick={() => navigate('/signup')}>Don't have an account? Sign Up!</button>
        </div>
    );
};
