import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Form, InputGroup, Stack} from "react-bootstrap";
import '../App.css'
import Container from "react-bootstrap/Container";
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
        fetch("https://vgtc.ca/api/google/oauthURL")
            .then(response => response.json())
            .then(data => {
                console.log("Received OAuth URL:", data.url);
                setGoogleURL(data.url);
            })
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
            const response = await fetch('https://vgtc.ca/api/login', {
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
      <Container className="App container-lg w-75 mx-auto mt-4">
          {isLoggedIn
          ? <h1 style={{textDecoration: "underline"}}>Log Out</h1>
              : <h1 style={{textDecoration: "underline"}}>Log In</h1>
          }
          {errorMessage && <div className="fail">{errorMessage}</div>}
          <Form>
              {!isLoggedIn
              ? <>
                  <Form.Group id="formEmail" controlId="formEmail">
                      <Form.Label></Form.Label>
                      <Form.Control
                          value={emailValue}
                          type="email"
                          placeholder="E-Mail"
                          name="email"
                          onChange={e => setEmailValue(e.target.value)}/>
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
                  <Form.Group>
                      <Button className="gsi-material-button mt-5"
                              disabled={!googleURL || isLoggedIn} // Disable if Google URL is not fetched or user is logged in
                              onClick={onGoogleLoginClicked}>
                          <div className="gsi-material-button-state"></div>
                          <div className="gsi-material-button-content-wrapper">
                              <div className="gsi-material-button-icon">
                                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                      <path fill="none" d="M0 0h48v48H0z"></path>
                                  </svg>
                              </div>
                              <span className="gsi-material-button-contents">Sign in with Google</span>
                              <span style={{display: "none"}}>Sign in with Google</span>
                          </div>
                      </Button>
                  </Form.Group>
                  <Form.Group>
                      <Button
                          className={"mt-3"}
                          variant={"outline-primary"}
                          size={"lg"}
                          style={{fontSize: "1.2rem"}}
                          disabled={!emailValue || !passwordValue || isLoggedIn} // Disable if fields are empty or user is logged in
                          onClick={onLogInClicked}>Log in with E-Mail
                      </Button>
                  </Form.Group>
                  <Form.Group>
                      <Button
                          className={"mt-3"}
                          variant={"outline-primary"}
                          size={"md"}
                          style={{fontSize: ".9rem"}}
                          onClick={() => navigate('/signup')}>Don't have an account? <br/> Sign Up!
                      </Button>
                  </Form.Group>
                  </>
              : <></>
              }
              {isLoggedIn
              ? <>
                  <Form.Group>
                      <Button
                          className={"mt-3"}
                          variant={"outline-primary"}
                          size={"md"}
                          style={{fontSize: ".9rem"}}
                          disabled={!isLoggedIn}
                          onClick={onLogOutClicked}>Log Out
                      </Button>
                  </Form.Group>
                  </>
              : <></>
              }
          </Form>
      </Container>
    );
};
