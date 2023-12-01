import {Form, Image, ListGroup} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useDebouncedCallback} from "use-debounce";
import {Desktop, Tablet, Mobile, Minimum} from "./MediaSettings"
function SearchBar(){

    const [searchText, setSearchText] = useState("");
    const [gamesReturn, setGamesReturn] = useState([{name:null, _id:""}]);

    const debounced = useDebouncedCallback(
        () => {
            searchGameAPI().then(r => {}).catch(e=>{});
        },
        500
    );

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        debounced();
    }
    const searchGameAPI = async () => {
        if (!searchText){

        } else {
            const response = await axios.get(`http://localhost:3000/api/search/${searchText}`);
            setGamesReturn(await response.data);
        }
    }
    const GameListing = (game) => {
        return <ListGroup key={game.name}>
            <ListGroup.Item>
                <a href={`/games/${game.game._id}`}
                   style={{textDecoration: "none"}}>
                    <Image src={game.game.img}
                           style={{width: "20px", marginRight: "5px"}}/>
                    <nobr style={{borderRight: "1px solid black",
                        paddingRight: "10px"}}>
                        {game.game.name}
                    </nobr>
                    <nobr className="text-muted small ps-2">
                        {game.game.gameConsole}
                    </nobr>
                </a>
            </ListGroup.Item>
        </ListGroup>
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
                            <GameListing game={game}/>
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
                            <GameListing game={game}/>
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
                            <GameListing game={game}/>
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
                            <GameListing game={game}/>
                        ))
                    }
                </Form.Text>
            </Minimum>
        </Form>
    )
}

export default SearchBar;