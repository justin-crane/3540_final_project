import {useState} from "react";
import axios from 'axios';
import {InputGroup, Stack, Form, Button} from 'react-bootstrap';

export  function AddGame(){
    const [gameList, setGameList] = useState();
    const [file, setFile] = useState()
    const [gameFormData, setGameFormData] = useState({
        formName: "",
        formConsole: "",
        img: "",
        formCondition: "",
        forTrade: false,
        forSale: false,
        formPrice: 0,
        username: "",
        userID: "",
        dateAdded: "",
        formNotes:""
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

        // const response = await axios.post('/api/addGameImage', formData,{
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // })
        //     .then(res => {
        //         imgLoc = res.data.imageLocation;
        //     })

        if (!imgLoc){
            imgLoc = "/images/placeholder_image.png";
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
        //getProductPrice(data.name);

        const gameRes = await axios.get(`http://localhost:3000/api/price/${data.name}`);
        if (!data.price){
            switch(gameFormData.formCondition){
                case "1":
                    data.price = (gameRes.data['loose-price']/100);
                    console.log("SETTING PRICE AS CONDITION 1");
                    break;
                case "2":
                    data.price = (gameRes.data['retail-cib-buy']/100);
                    console.log("SETTING PRICE AS CONDITION 2");
                    break;
                case "3":
                    data.price = (gameRes.data['retail-cib-sell']/100);
                    console.log("SETTING PRICE AS CONDITION 3");
                    break;
                case "4":
                    data.price = (gameRes.data['retail-new-buy']/100);
                    console.log("SETTING PRICE AS CONDITION 4");
                    break;
                case "5":
                    data.price = (gameRes.data['new-price']/100);
                    console.log("SETTING PRICE AS CONDITION 5");
                    break;
                default:
                    data.price = gameRes.data['loose-price'];
                    console.log("SETTING PRICE AS CONDITION DEFAULT");
                    break;
            }
        }
        console.log("GAME ID: ",gameRes.data.id);
        console.log("GAME PRODUCT NAME: ", gameRes.data['product-name'])
        console.log("GAME GENRE NAME: ", gameRes.data['genre'])
        console.log("GAME RELEASE DATE: ", gameRes.data['release-date'])
        console.log("GAME PRODUCT NAME: ", gameRes.data['product-name'])
        console.log("GAME DATE ADDED: ", data.dateAdded)
        console.log("PRICE RETURN IS: $" + data.price)
        data['genre'] = gameRes.data['genre'];
        data['release-date'] = gameRes.data['release-date'];
        data['gameConsole'] = gameRes.data['console-name'];
        data['genre'] = gameRes.data['genre'];
        console.log(data);
        //const responseGames = await axios.post(`/api/addgame`, data);
        alert(`${gameFormData.name} submitted successfully.`)
        //console.log(responseGames);
        //e.target.reset();

/*
        TODO :
            - Integrate price data pulled from API into the data sent to our
            database.
            - Have search include console along with game name, and then loop through
                products and return result by console + game name
 */
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
                        <Form.Control
                            type="text"
                            placeholder="Console"
                            name="formConsole"
                            onChange={updateGameForm}/>
                    </Form.Group>
                    <Form.Group id="formCondition" controlId="formCondition">
                        <Form.Label></Form.Label>
                        <Form.Select aria-label={"Condition Selection"}
                            type="text"
                            name="formCondition"
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
                                name={"formPrice"}
                            />
                            <InputGroup.Text>.00</InputGroup.Text>
                        </Stack>
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