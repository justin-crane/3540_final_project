import React, {useEffect, useRef, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import {Card} from "react-bootstrap";

const socket = io.connect('http://localhost:3002');

const MessengerPage = (props) => {

    const [messageData, setMessageData] = useState({
        sender: "",
        recipient: "",
        messageBody: "",
    });

    const [room, setRoom] = useState("");
    const [sender, setSender] = useState("");
    const [recipient, setRecipient] = useState("");
    const [messageEvents, setMessageEvents] = useState([]);
    const [userMessages, setUserMessages] = useState([]);
    const div = useRef(null);
    useEffect(() => div.current.scrollIntoView ({
        behavior: "smooth",
        block: "end"}), [messageEvents.length]);

    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room);
        }
    };
    const sendMessage = () => {
        socket.emit("send_message", { messageData, room });
    };
    const loadMessages = async (sender, recipient) => {
        if (sender !== ""){
            const response = await axios.get(`http://localhost:3000/api/message/${sender}/${recipient}`);
            const messageList = await response.data.chatLog;
            setRoom(response.data._id);
            setMessageEvents(messageList);
            joinRoom();
        }
    };

    const getAllMessages = async () => {
        const user = jwtDecode(localStorage.getItem("token")).username;
        const response = await axios.get(`/api/messages/${user}`);
        console.log(response.data)
        const messages = await response.data;
        setUserMessages(messages);
    }

    function updateMessageForm(e){
        const key = e.target.name;
        const value = e.target.value;
        setMessageData({...messageData, [key]: value});
    }

    const submit = async (e) => {
        e.preventDefault();
        console.log(sender);
        console.log(recipient);
        let data = {
            sender: sender,
            recipient: recipient,
            messageBody: messageData.messageBody,
        };

        setMessageData(data);
        if (sender !== ""){
            const responseMessage = await axios.post(`/api/message`, data);
            console.log(`${sender}'s message sent successfully.`);
            e.target.reset();
            sendMessage();
        }
    }
    const location = useLocation();
    useEffect(() => {
        if (localStorage.getItem("token")){
            setSender(jwtDecode(localStorage.getItem("token")).username);
        } else {
            alert("You must be logged in to send a message.");
        }
        setRecipient(props.recip);
        //setRecipient(location.state.recip);

        loadMessages(sender, recipient).catch((e) => console.log(e));
        getAllMessages().catch((e) => console.log(e));
    }, [])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessageEvents(messageEvents);
        });
        loadMessages(sender, recipient).catch((e) => console.log(e));
    }, [submit, socket]);

    return (
        <Container >
            <Card style={{maxHeight: "750px"}}>
                <Card.Body style={{maxHeight: "600px", overflow:"scroll"}}>
                    <div id="messages">
                        <ul>
                            {
                                messageEvents.map((message, i) => (
                                    <Card key={i}
                                    style={{marginRight: "5%", marginTop: "10px", marginBottom: "10px"}}
                                    >
                                        <Card.Header>
                                            <Card.Text>Sent from: {message.sender}</Card.Text>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                {message.message}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Card.Text
                                                style={{fontSize:"0.75rem", textAlign:"left"}}>
                                                Sent at{" "}
                                                {new Date(message.timeStamp).getHours()}:
                                                {new Date(message.timeStamp).getMinutes()} on {" "}
                                                {new Date(message.timeStamp).getDate()}, {" "}
                                                {new Date(message.timeStamp).getMonth()}, {" "}
                                                {new Date(message.timeStamp).getFullYear()}
                                            </Card.Text>
                                        </Card.Footer>
                                    </Card>
                                ))
                            }
                        </ul>
                        <div ref={div}/>
                    </div>
                </Card.Body>
                <Card.Footer className={"text-center"}>
                        <Card.Text>Send a message</Card.Text>
                        <Form onSubmit={submit} >
                            <Form.Group id="formMessage" controlId="formMessage">
                                <Form.Label></Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Message"
                                    name="messageBody"
                                    style={{height: "4rem"}}
                                    onChange={updateMessageForm}/>
                            </Form.Group>
                            <Button type="submit" variant="outline-success m-3 w-25" >Send</Button>
                        </Form>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default MessengerPage;

