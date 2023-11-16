import { Link } from "react-router-dom";
import {useState} from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export  function AddGame(){

    const {gameList, setGameList} = useState();

    const [gameFormData, setGameFormData] = useState({
        name: "",
        gameConsole: "",
        img: "",
        condition: "",
        availability: "",
        notes:""
    })

    function updateGameForm(e){
        const key = e.target.name;
        const value = e.target.value;
        setGameFormData({...gameFormData, [key]: value});
    }
    const submit = async (e) => {
        e.preventDefault();

        const responseGames = await axios.post(`/api/addgame`, {
            name: gameFormData.name,
            gameConsole: gameFormData.console,
            condition: gameFormData.condition,
            availability: gameFormData.availability,
            notes: gameFormData.notes,
            img: gameFormData.img,
        });

        alert(`${gameFormData.name} submitted successfully.`)

        console.log(responseGames);

        e.target.reset();
    }
    return (
        <div className="App container-lg">
            <nav>
                <Link className="navbar bg-body-tertiary h1" to="/">See Games</Link>
            </nav>
            <div className="w-75 mx-auto">
                <h1>Submit a Game</h1>

                <Form onSubmit={submit}>
                    <Form.Group id="formName" controlId="formName">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Game Name"
                            name="name"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formConsole" controlId="formConsole">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Console"
                            name="console"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formCondition" controlId="formCondition">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Condition"
                            name="condition"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formAvailability" controlId="formAvailability">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Availability"
                            name="availability"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formNotes" controlId="formNotes">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Notes"
                            name="notes"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formIMG" controlId="formIMG">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Image (Placeholder, just add text for now)"
                            name="img"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Button type="submit" variant="outline-success m-3 w-25" >Submit</Button>
                </Form>
            </div>
        </div>
    )
}