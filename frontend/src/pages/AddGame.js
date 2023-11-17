import { Link } from "react-router-dom";
import {useState} from "react";
import axios from 'axios';
import {InputGroup, Stack, Form, Button} from 'react-bootstrap';



export  function AddGame(){

    const [gameList, setGameList] = useState();
    const [file, setFile] = useState()

    const [gameFormData, setGameFormData] = useState({
        name: "",
        gameConsole: "",
        img: "",
        condition: "",
        forTrade: false,
        forSale: false,
        price: 0,
        username: "",
        userID: "",
        dateAdded: "",
        notes:""
    })

    function updateGameForm(e){
        const key = e.target.name;
        let value = e.target.value;
        console.log("ADD GAME KEY VALUE: " + key + ", " + value);
        setGameFormData({...gameFormData, [key]: value});
    }
    const handleFile = (e) => {
        const fileImg = e.target.files[0];
        setFile(fileImg)
    }
    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        let imgLoc;
        formData.append("img", file)

        const response = await axios.post('/api/addGameImage', formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                imgLoc = res.data.imageLocation;
            })

        if (!imgLoc){
            imgLoc = "/images/placeholder_image.png";
        }

        let data = {
            name: gameFormData.name,
            gameConsole: gameFormData.gameConsole,
            condition: gameFormData.condition,
            forTrade: gameFormData.forTrade,
            forSale: gameFormData.forSale,
            price: gameFormData.price,
            notes: gameFormData.notes,
            dateAdded: new Date().getUTCDate(),
            username: "TODO",
            userID: "TODO",
            img: imgLoc,
        };
        const responseGames = await axios.post(`/api/addgame`, data);
        alert(`${gameFormData.name} submitted successfully.`)
        console.log(responseGames);
        e.target.reset();
    }
    return (
        <div className="App container-lg">
            <div className="w-75 mx-auto">
                <h1>Submit a Game</h1>

                <Form onSubmit={submit} >
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
                        <Form.Select aria-label={"Condition Selection"}
                            type="text"
                            name="condition"
                            onChange={updateGameForm}>
                            <option selected={true} disabled={true}>Selection Condition: </option>
                            <option value={1}>1 - Poor</option>
                            <option value={2}>2 - Flawed</option>
                            <option value={3}>3 - Some flaws</option>
                            <option value={4}>4 - Near-mint</option>
                            <option value={5}>5 - Mint</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id="forTrade" controlId="forTrade">
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"For Trade Select"}
                                     type="text"
                                     name="forTrade"
                                     onChange={updateGameForm}>
                            <option selected={true} disabled={true}>For Trade?</option>
                            <option value={false}>Not For Trade</option>
                            <option value={true}>For Trade</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id="forSale" controlId="forSale" className={"mb-4"}>
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"For Sale Select"}
                                     type="text"
                                     name="forSale"
                                     onChange={updateGameForm}>
                            <option selected={true} disabled={true}>For Sale?</option>
                            <option value={false}>Not For Sale</option>
                            <option value={true}>For Sale</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id={"formPrice"} controlId={"formPrice"}>
                        <Stack direction={"horizontal"}>
                            <Form.Label></Form.Label>
                            <InputGroup.Text>Price: $</InputGroup.Text>
                            <Form.Control
                                aria-label={"Price (to the nearest dollar"}
                                onChange={updateGameForm}
                                label={"price"}
                                name={"price"}
                            />
                            <InputGroup.Text>.00</InputGroup.Text>
                        </Stack>
                    </Form.Group>
                    <Form.Group id="formNotes" controlId="formNotes">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Conditon notes, etc... "
                            name="notes"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formIMG" controlId="formIMG">
                        <Form.Label className={"pt-5"}>Image Upload: </Form.Label>
                        <Form.Control
                            formAction="/upload_files"
                            type="file"
                            encType="multipart/form-data"
                            label="Image"
                            name="img"
                            onChange={handleFile}
                        />
                    </Form.Group>
                    <Button type="submit" variant="outline-success m-3 w-25" >Submit</Button>
                </Form>
            </div>
        </div>
    )
}