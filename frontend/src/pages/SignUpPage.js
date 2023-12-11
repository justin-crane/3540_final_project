import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Form} from "react-bootstrap";
import Container from "react-bootstrap/Container";

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
            const response = await fetch('/api/register', {
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
        <Container className="App container-lg w-75 mx-auto mt-4">
            <h1>Sign Up</h1>
            {errorMessage && <div className="fail">{errorMessage}</div>}
            <Form>
                <Form.Group id="formEmail" controlId="formEmail">
                    <Form.Label></Form.Label>
                    <Form.Control
                        value={usernameValue}
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={e => setUsernameValue(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label></Form.Label>
                    <Form.Control
                        value={emailValue}
                        type="email"
                        placeholder="E-Mail"
                        name="email"
                        onChange={e => setEmailValue(e.target.value)}/>
                    <Form.Text className="text-muted pl-2" style={{textAlign:"left"}}>
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group id="formPassword" controlId="formPassword">
                    <Form.Label></Form.Label>
                    <Form.Control
                        value={passwordValue}
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={e => setPasswordValue(e.target.value)}/>
                </Form.Group>
                <Form.Group id="formConfirmPassword" controlId="formConfirmPassword">
                    <Form.Label></Form.Label>
                    <Form.Control
                        value={confirmPasswordValue}
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={e => setConfirmPasswordValue(e.target.value)}/>
                </Form.Group>
                <Form.Group>
                </Form.Group>
                <Form.Group>
                    <Button
                        className={"mt-3"}
                        variant={"outline-primary"}
                        size={"lg"}
                        style={{fontSize: "1.2rem"}}
                        disabled={
                            !usernameValue || !emailValue || !passwordValue ||
                            passwordValue !== confirmPasswordValue
                        }

                        onClick={onSignUpClicked}>Sign Up
                    </Button>
                </Form.Group>
                <Form.Group>
                    <Button
                        className={"mt-3"}
                        variant={"outline-primary"}
                        size={"md"}
                        style={{fontSize: ".9rem"}}
                        onClick={() => navigate('/login')}>Already have an account?<br/>Log In!
                    </Button>
                </Form.Group>
            </Form>
        </Container>
    );
};
