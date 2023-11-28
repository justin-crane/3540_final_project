import {Form, Image, ListGroup, Tooltip} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useDebouncedCallback} from "use-debounce";

function SearchBar(){

    /*
    *
    *   TODO: WIP Still.
    *    - Clear game array when search box is empty
    *    - Fix styling of search results.
    *    - Add link to each game that returns
    *    - Limit array to X amount of results returned (possibly on back-end call to mongo)
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
                className="me-2 w-100"
                aria-label="Search"
                onChange={handleSearch}
            />
            <Form.Text
                className={"w-100"}
                style={{position: "fixed", zIndex: "2", top:"100px"}}
            >
                {searchText === ""
                    ? <></>
                    : gamesReturn.map(game => (
                        <ListGroup key={game.name}>
                            <ListGroup.Item>
                                <Image src={game.img} style={{width: "20px"}}/>
                                {game.name}
                                {game.console}
                            </ListGroup.Item>
                        </ListGroup>
                    ))
                }
            </Form.Text>
        </Form>
    )
}

export default SearchBar;