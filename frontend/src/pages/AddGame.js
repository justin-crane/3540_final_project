import {useState, useEffect} from "react";
import {InputGroup, Stack, Form, Button} from 'react-bootstrap';
import {getGame} from "../components/PriceChartAPIProcess";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export  function AddGame(){
    const [gameList, setGameList] = useState();
    const [file, setFile] = useState();
    const consoleList = ['Atari', 'Commodore 64', 'Famicom', 'Gameboy', 'Gameboy Color',
        'Gameboy Advance', 'Gamecube', 'NES', 'Neo Geo', 'N-Gage', 'Nintendo 64',
        'Nintendo 3DS', 'Nintendo DS', 'Nintendo Switch', 'PC', 'PSP', 'Playstation Vita',
        'Playstation', 'Playstation 2', 'Playstation 3', 'Playstation 4', 'Playstation 5',
        'Sega Dreamcast', 'Sega Game Gear', 'Sega Genesis', 'Sega Master System', 'Sega Saturn',
        'Super Famicom', 'Super Nintendo', 'Virtual Boy', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X']
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setGameFormData(prevFormData => ({
                ...prevFormData,
                username: decodedToken.username,
                userID: decodedToken.id,
            }));
        } else {
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
        setLoading(true);

        const formData = new FormData();
        let imgLoc = gameFormData.img || "/images/placeholder_image.png";
        if (file) {
            formData.append("img", file);
            try {
                const imageResponse = await axios.post('/api/addGameImage', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imgLoc = imageResponse.data.imageLocation;
            } catch (error) {
                console.error('Error uploading image:', error);
                // Handle image upload error
            }
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
            img: imgLoc,
            userInfo: {
                username: gameFormData.username,
                userID: gameFormData.userID,
            },
        };

        // Fetch game data from the external API and update local data
        try {
            const updatedData = await getGame(data, gameFormData);
            console.log("Updated Data: ", updatedData);
            data = { ...data, ...updatedData }; // Merge updated data with local data

            const token = localStorage.getItem('token');
            const responseGames = await axios.post('http://localhost:3001/api/addgame', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("ADD GAME RETURN DATA: ", responseGames.data);
            alert(`${data.name} submitted successfully.`);
            setGameList([...gameList, responseGames.data]); // Update the game list
        } catch (error) {
            console.error('Error in getGameFromAPI or adding game:', error);
            // Handle errors from getGameFromAPI or game submission
        }

        setLoading(false);
        e.target.reset();
    };


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