import {Form, Image, ListGroup, Tooltip} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useDebouncedCallback} from "use-debounce";
import {MediaQuery, useMediaQuery} from 'react-responsive';
import {Desktop, Tablet, Mobile, Minimum} from "./MediaSettings"
function SearchBar(){

    /*
    *
    *   TODO: WIP Still.
    *    - Clear game array when search box is empty
    *    - Add link to each game that returns
    *    - Limit array to X amount of results returned (possibly on back-end call to mongo)
    *    - Maybe put media query const variables into their own component w/export for reusability.
    *
    * */

    const [searchText, setSearchText] = useState("");
    const [gamesReturn, setGamesReturn] = useState([{name:null, _id:""}]);

    const debounced = useDebouncedCallback(
        () => {
            searchGameAPI().then(r => {}).catch(e=>{});
        },
        // delay in ms
        500
    );

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        console.log("SEARCH VALUE: ", e.target.value);
        //searchGameAPI();
        debounced();
    }
    const searchGameAPI = async () => {
        if (!searchText){

        } else {
            const response = await axios.get(`http://localhost:3000/api/search/${searchText}`);
            setGamesReturn(await response.data);
            console.log("GAME RETURN: ", await response.data)
        }
    }

    if(!gamesReturn){
        setGamesReturn([{}, {}]);
    }

    return (
        <Form className="d-flex w-100">
            <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 w-100 ms-3"
                aria-label="Search"
                onChange={handleSearch}
                style={{maxWidth: "600px", minWidth: "230px"}}
            />
            <Desktop>
                <Form.Text
                    style={{position: "absolute", zIndex: "2", top:"100px",
                    marginLeft: "20px", marginRight: "50px"}}
                >
                    {searchText === ""
                        ? <></>
                        : gamesReturn.map(game => (
                            <ListGroup key={game.name}>
                                <ListGroup.Item>
                                    <Image src={game.img}
                                           style={{width: "20px"}}/>
                                    {game.name} {"  "}|{"  "}
                                    <nobr className="text-muted small">
                                            {game.gameConsole}
                                    </nobr>
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    }
                </Form.Text>
            </Desktop>
            <Tablet>
                <Form.Text
                    style={{position: "absolute", zIndex: "2", top: "405px",
                    marginLeft: "20px", width:"590px"}}>
                    {searchText === ""
                        ? <></>
                        : gamesReturn.map(game => (
                            <ListGroup key={game.name}>
                                <ListGroup.Item>
                                    <Image src={game.img} style={{width: "20px"}}/>
                                    {game.name} {"  "}|{"  "}
                                    <nobr className="text-muted small">
                                        {game.gameConsole}
                                    </nobr>
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    }
                </Form.Text>
            </Tablet>
            <Mobile>
                <Form.Text
                    style={{position: "absolute", zIndex: "2",
                        width: "590px", top: "405px", marginLeft: "20px"}}
                >
                    {searchText === ""
                        ? <></>
                        : gamesReturn.map(game => (
                            <ListGroup key={game.name}>
                                <ListGroup.Item>
                                    <Image src={game.img} style={{width: "20px"}}/>
                                    {game.name} {"  "}|{"  "}
                                    <nobr className="text-muted small">
                                        {game.gameConsole}
                                    </nobr>
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    }
                </Form.Text>
            </Mobile>
            <Minimum>
                <Form.Text
                    style={{position: "absolute", zIndex: "2",
                        width: "490px", top: "440px", marginLeft: "20px"}}
                >
                    {searchText === ""
                        ? <></>
                        : gamesReturn.map(game => (
                            <ListGroup key={game.name}>
                                <ListGroup.Item >
                                    <Image src={game.img} style={{width: "20px"}}/>
                                    {game.name} {"  "}|{"  "}
                                    <nobr className="text-muted small">
                                        {game.gameConsole}
                                    </nobr>
                                </ListGroup.Item>
                            </ListGroup>
                        ))
                    }
                </Form.Text>
            </Minimum>
        </Form>
    )
}

export default SearchBar;