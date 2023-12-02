import './App.css';
import GameProfile from "./pages/GameProfile";
import GameCollection from "./pages/GameCollection";
import UserProfile from "./pages/UserProfile";
import OtherUserProfile from "./pages/OtherUserProfile";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import RandomGame from "./pages/RandomGame";
import {LogInPage} from "./pages/LogInPage";
import {SignUpPage} from "./pages/SignUpPage";
import {AddGame} from "./pages/AddGame";
import {useEffect, useState} from "react";
import axios from "axios";
import MessengerPage from "./pages/MessengerPage";
import Image from "react-bootstrap/Image";


function App() {

    let [gameList, setGameList] = useState();
    const [randomGame, setRandomGame] = useState();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const loadGames = async () => {
            const response = await axios.get(`http://localhost:3000/api/gamelist/`);
            const newGameList = await response.data;
            setGameList(newGameList);
            const randomRes = await axios.get(`http://localhost:3000/api/randomgame/`);
            setRandomGame(await randomRes.data);
            setLoading(false);
        };
        loadGames().catch((e) => console.log(e));
    }, []);

    if (!gameList){
        setGameList([]);
    }
    if(!randomGame){
        setRandomGame([]);
    }
    if(isLoading){
        return <Image src={"../../VGTC_Logo_small.PNG"} fluid rounded
                      className={"w-25"} style={{position: "absolute",top: "35%", left: "35%"}}/>
    } else {
        return (
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path={"/"} element={<GameCollection gameList={gameList} setGameList={setGameList}/>} />
                        <Route path={"/games/:gameId"} element={<GameProfile gameList={gameList} setGameList={setGameList}/>} />
                        <Route path={"/addgame"} element={<AddGame/>}/>
                        <Route path={"/user"} element={<UserProfile/>} />
                        <Route path={"/user/:id"} element={<OtherUserProfile/>} />
                        <Route path={`/games/random`} element={<RandomGame gameList={gameList} randomGameId={randomGame[0]._id} />} />
                        <Route path={"/login"} element={<LogInPage />} />
                        <Route path={"/signup"} element={<SignUpPage />} />
                        <Route path={"/addgame"} element={<AddGame gameList={gameList} setGameList={setGameList}/>} />
                        <Route path={"/messenger"} element={<MessengerPage />} />
                    </Routes>
                </BrowserRouter>
            </>
        );
    }
}

export default App;