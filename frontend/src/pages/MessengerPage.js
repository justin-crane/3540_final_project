import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const socket = io.connect('http://localhost:3002');

const MessengerPage = () => {

    const [messageData, setMessageData] = useState({
        sender: "",
        recipient: "",
        messageBody: "",
    });

    const [room, setRoom] = useState("");
    const [sender, setSender] = useState("");
    const [recipient, setRecipient] = useState("");
    const [messageEvents, setMessageEvents] = useState([]);

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

    useEffect(() => {
        loadMessages(sender, recipient).catch((e) => console.log(e));
    }, []);

    function updateMessageForm(e){
        const key = e.target.name;
        const value = e.target.value;
        setMessageData({...messageData, [key]: value});
    }

    const submit = async (e) => {
        e.preventDefault();
        if (localStorage.getItem("token")){
            setSender(jwtDecode(localStorage.getItem("token")).email);
        }
        else {
            alert("You must be logged in to send a message.");
        }
        setRecipient(messageData.recipient);
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

    useEffect(() => {
        loadMessages(sender, recipient).catch((e) => console.log(e));
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessageEvents(messageEvents);
        });
    }, [submit, socket]);

    return (
        <div className="App container-lg">
            <div id="messages">
                <ul>
                    {
                        messageEvents.map((message, i) => (
                            <li key={i}>
                                <h3>{message.sender}</h3>
                                <p>{message.message}</p>
                                <p>sent@{new Date(message.timeStamp).toString()}</p>
                            </li>
                        ))
                    }
                </ul>
            </div>
        <footer>
            <div className="w-75 mx-auto">
                <h1>Send a message</h1>
                <Form onSubmit={submit} >
                    <Form.Group id="formRecipient" controlId="formRecipient">
                        <Form.Label>Recipient:</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="user Name"
                            name="recipient"
                            onChange={updateMessageForm}/>
                    </Form.Group>
                    <Form.Group id="formMessage" controlId="formMessage">
                        <Form.Label></Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Message"
                            name="messageBody"
                            onChange={updateMessageForm}/>
                    </Form.Group>
                    <Button type="submit" variant="outline-success m-3 w-25" >Send</Button>
                </Form>
            </div>
        </footer>
        </div>
    );
}

export default MessengerPage;

