import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:3002');

const MessengerPage = () => {

    const [messageData, setMessageData] = useState({
        sender: "",
        recipient: "",
        message: "",
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
        const response = await axios.get(`http://localhost:3000/api/message/${sender}/${recipient}`);
        console.log(response);
        const messageList = await response.data.chatLog;
        setRoom(response.data._id);
        setMessageEvents(messageList);
        joinRoom();
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
        let data = {
            sender: messageData.sender,
            recipient: messageData.recipient,
            messageBody: messageData.message,
        };

        const responseMessage = await axios.post(`/api/message`, data);
        console.log(`${messageData.sender}'s message sent successfully.`);
        console.log(responseMessage);
        e.target.reset();
        setSender(data.sender);
        setRecipient(data.recipient);
        sendMessage();
    }

    useEffect(() => {
        loadMessages(sender, recipient).catch((e) => console.log(e));
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessageEvents(messageEvents);
        });
    }, [submit]);

    return (
        <div className="App container-lg">
            <div className="w-75 mx-auto">
                <h1>Send a message</h1>
                <Form onSubmit={submit} >
                    <Form.Group id="formSender" controlId="formSender">
                        <Form.Label>Sender:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="user Name"
                            name="sender"
                            onChange={updateMessageForm}/>
                    </Form.Group>
                    <Form.Group id="formRecipient" controlId="formRecipient">
                        <Form.Label>Recipient:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="user Name"
                            name="recipient"
                            onChange={updateMessageForm}/>
                    </Form.Group>
                    <Form.Group id="formMessage" controlId="formMessage">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Message"
                            name="message"
                            onChange={updateMessageForm}/>
                    </Form.Group>
                    <Button type="submit" variant="outline-success m-3 w-25" >Send</Button>
                </Form>
            </div>

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

        </div>
    );
}

export default MessengerPage;

