import {useState, useEffect} from "react";
import {InputGroup, Stack, Form, Button} from 'react-bootstrap';
import {getGame} from "../components/PriceChartAPIProcess";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export  function AddGame(){
    const [gameList, setGameList] = useState();
    const [file, setFile] = useState();
    const consoleList = ['Atari', 'Commodore 64', 'Famicom', 'Gameboy', 'Gameboy Color',
        'Gameboy Advance', 'Gamecube', 'NES', 'Neo Geo', 'N-Gage', 'Nintendo 64',
        'Nintendo 3DS', 'Nintendo DS', 'Nintendo Switch', 'PC', 'PSP', 'Playstation',
        'Playstation 2', 'Playstation 3', 'Playstation 4', 'Playstation 5', 'Sega Dreamcast',
        'Sega Game Gear', 'Sega Genesis', 'Sega Master System', 'Sega Saturn', 'Super Famicom',
        'Super Nintendo', 'Virtual Boy', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X']
    const [gameFormData, setGameFormData] = useState({
        formName: "",
        formConsole: "",
        img: null,
        formCondition: "",
        forTrade: false,
        forSale: false,
        formPrice: 0,
        username: "",
        userID: "",
        dateAdded: "",
        formNotes:""
    })
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token is found, redirect to the login page
            navigate('/login');
        }
    }, [navigate]);
    function updateGameForm(e){
        const key = e.target.name;
        let value = e.target.value;
        console.log("ADD GAME KEY VALUE: " + key + ", " + value);
        setGameFormData({...gameFormData, [key]: value});
    }
    const handleFile = (e) => {
        const fileImg = e.target.files[0];
        setFile(fileImg)
        updateGameForm(e);
    }
    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        let imgLoc;
        formData.append("img", file)

        if (!gameFormData.img){
            imgLoc = "/images/placeholder_image.png";
        } else {
            const response = await axios.post('/api/addGameImage', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    imgLoc = res.data.imageLocation;
                })
        }

        let data = {
            name: gameFormData.formName,
            gameConsole: gameFormData.formConsole,
            condition: gameFormData.formCondition,
            forTrade: gameFormData.forTrade,
            forSale: gameFormData.forSale,
            price: gameFormData.formPrice,
            notes: gameFormData.formNotes,
            dateAdded: new Date(),
            username: "TODO",
            userID: "TODO",
            img: imgLoc,
        };

        const getGameFromAPI = async () => {
            await getGame(data, gameFormData)
                .then(res => console.log(data = res)).catch(e => console.log(e))
            await console.log("ADD GAME RETURN DATA: ", data);
            const responseGames = await axios.post(`/api/addgame`, data);
            await alert(`${data.name} submitted successfully.`)
            await e.target.reset();
        };
        getGameFromAPI().catch((e) => console.log(e));

    }
    if (!localStorage.getItem('token')) {
        // If the user is not authenticated, display a message
        return <div>Please log in to add a game</div>;
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
                            name="formName"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formConsole" controlId="formConsole">
                        <Form.Label></Form.Label>
                        <Form.Select
                                required
                                aria-label={"Console Selection"}
                                type="text"
                                name="formConsole"
                                defaultValue={0}
                                onChange={updateGameForm}>
                            <option value={0} disabled={true}>Select Console: </option>
                            {consoleList.map((item) => (<option key={item} value={item}>{item}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id="formCondition" controlId="formCondition">
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"Condition Selection"}
                            type="text"
                            name="formCondition"
                            defaultValue={0}
                            onChange={updateGameForm}>
                            <option value={0} disabled={true}>Selection Condition: </option>
                            <option value={1}>1 - Loose/No Original Box/Poor Condition</option>
                            <option value={2}>2 - Box Only/Manual Only/Flawed</option>
                            <option value={3}>3 - Has Original Boxing/Some Minor Flaws</option>
                            <option value={4}>4 - Near-mint Condition</option>
                            <option value={5}>5 - Mint/New</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id="forTrade" controlId="forTrade">
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"For Trade Select"}
                                     type="text"
                                     name="forTrade"
                                     defaultValue={0}
                                     onChange={updateGameForm}>
                            <option value={0} disabled={true}>For Trade?</option>
                            <option value={false}>Not For Trade</option>
                            <option value={true}>For Trade</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group id="forSale" controlId="forSale" className={"mb-4"}>
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"For Sale Select"}
                                     type="text"
                                     name="forSale"
                                     defaultValue={0}
                                     onChange={updateGameForm}>
                            <option value={0} disabled={true}>For Sale?</option>
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
                                name={"formPrice"}
                            />
                            <InputGroup.Text>.00</InputGroup.Text>
                        </Stack>
                        <Form.Text
                            style={{fontSize:"0.75rem", textAlign:"left"}}
                        >*Price will generate based on game condition if no price is entered here.</Form.Text>
                    </Form.Group>
                    <Form.Group id="formNotes" controlId="formNotes">
                        <Form.Label></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Conditon notes, etc... "
                            name="formNotes"
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