import React, { useState, useEffect } from 'react';
import { Form, Button, Stack, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const consoleList = ['Atari', 'Commodore 64', 'Famicom', 'Gameboy', 'Gameboy Color',
    'Gameboy Advance', 'Gamecube', 'NES', 'Neo Geo', 'N-Gage', 'Nintendo 64',
    'Nintendo 3DS', 'Nintendo DS', 'Nintendo Switch', 'PC', 'PSP', 'Playstation Vita',
    'Playstation', 'Playstation 2', 'Playstation 3', 'Playstation 4', 'Playstation 5',
    'Sega Dreamcast', 'Sega Game Gear', 'Sega Genesis', 'Sega Master System', 'Sega Saturn',
    'Super Famicom', 'Super Nintendo', 'Virtual Boy', 'Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X']
const conditionOptions = ['1 - Loose/No Original Box/Poor Condition', '2 - Box Only/Manual Only/Flawed', '3 - Has Original Boxing/Some Minor Flaws', '4 - Near-mint Condition', '5 - Mint/New'];

export const EditGameForm = ({ game, handleUpdate, cancelEdit }) => {
    const [formData, setFormData] = useState({
        name: game.name || '',
        gameConsole: game.gameConsole || '',
        condition: game.condition || '',
        forTrade: game.forTrade || false,
        forSale: game.forSale || false,
        price: game.price || '',
        notes: game.notes || '',
        img: game.img || ''
    });
    const [file, setFile] = useState(null);
    const [fetchedPrice, setFetchedPrice] = useState(null);

    useEffect(() => {
        setFormData(game);
    }, [game]);

    useEffect(() => {
        if (formData.gameConsole && formData.name && formData.condition) {
            fetchPrice(formData.name, formData.gameConsole, formData.condition);
        }
    }, [formData.gameConsole, formData.name, formData.condition]);

    const fetchPrice = async (gameName, consoleName, condition) => {
        try {
            const response = await axios.post(`/api/price/${gameName}/${consoleName}`);
            const data = response.data;

            let price;
            switch (condition) {
                case "1": // Loose/No Original Box/Poor Condition
                    price = data['loose-price'] / 100;
                    break;
                case "2": // Box Only/Manual Only/Flawed
                    price = data['retail-cib-buy'] / 100;
                    break;
                case "3": // Has Original Boxing/Some Minor Flaws
                    price = data['retail-cib-sell'] / 100;
                    break;
                case "4": // Near-mint Condition
                    price = data['retail-new-buy'] / 100;
                    break;
                case "5": // Mint/New
                    price = data['new-price'] / 100;
                    break;
                default:
                    price = null;
            }

            if (price) {
                setFetchedPrice(price);
            } else {
                setFetchedPrice(null);
            }
        } catch (error) {
            console.error('Error fetching price:', error);
            setFetchedPrice(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        let imgLoc = formData.img;
        if (file) {
            const formData = new FormData();
            formData.append("img", file);

            try {
                const imageResponse = await axios.post('/api/addGameImage', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imgLoc = imageResponse.data.imageLocation;
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        console.log('Manual Price:', formData.price, 'Fetched Price:', fetchedPrice);

        const finalPrice = formData.price === '' ? fetchedPrice : formData.price;
        console.log('Final Price to submit:', finalPrice);

        handleUpdate({ ...formData, price: finalPrice, img: imgLoc });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Game Name */}
            <Form.Group controlId="formName">
                <Form.Label>Game Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Game Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}/>
            </Form.Group>

            {/* Game Console */}
            <Form.Group className={"pt-2"} controlId="formConsole">
                <Form.Label>Console</Form.Label>
                <Form.Select
                    name="gameConsole"
                    value={formData.gameConsole}
                    onChange={handleChange}>
                    {consoleList.map((console, index) => (
                        <option key={index} value={console}>{console}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Condition */}
            <Form.Group className={"pt-2"} controlId="formCondition">
                <Form.Label>Condition</Form.Label>
                <Form.Select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}>
                    {conditionOptions.map((condition, index) => (
                        <option key={index} value={condition.split(' - ')[0]}>{condition}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* For Trade */}
            <Form.Group className={"pt-2"} controlId="forTrade">
                <Form.Label>For Trade</Form.Label>
                <Form.Select
                    name="forTrade"
                    value={formData.forTrade?.toString()}
                    onChange={handleChange}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
            </Form.Group>

            {/* For Sale */}
            <Form.Group className={"pt-2"} controlId="forSale">
                <Form.Label>For Sale</Form.Label>
                <Form.Select
                    name="forSale"
                    value={formData.forSale?.toString()}
                    onChange={handleChange}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </Form.Select>
            </Form.Group>
            {/* Price */}
            <Form.Group className={"pt-2"} id={"formPrice"} controlId={"formPrice"}>
                <Stack direction={"horizontal"}>
                    <Form.Label className={"pe-1"}>Price </Form.Label>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                    />
                    <InputGroup.Text>.00</InputGroup.Text>
                </Stack>
            </Form.Group>
            {/* Notes */}
            <Form.Group className={"pt-2"} controlId="formNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}/>
            </Form.Group>
            {/* Image Upload */}
            <Form.Group className={"pt-2"} controlId="formIMG">
                <Form.Label>Image Upload</Form.Label>
                <Form.Control
                    type="file"
                    name="img"
                    onChange={handleFileChange}
                />
            </Form.Group>

            {/* Buttons */}
            <Stack className={"pt-3 justify-content-center"} direction="horizontal" gap={2}>
                <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
            </Stack>
        </Form>
    );
};
