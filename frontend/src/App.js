import './App.css';
import Home from "./pages/Home";
import GameProfile from "./pages/GameProfile";
import GameCollection from "./pages/GameCollection";
import UserProfile from "./pages/UserProfile";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import RandomGame from "./pages/RandomGame";
import {LogInPage} from "./pages/LogInPage";
import {SignUpPage} from "./pages/SignUpPage";
import {AddGame} from "./pages/AddGame";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
  //code

    let [gameList, setGameList] = useState();

    useEffect(() => {
        const loadGames = async () => {
            const response = await axios.get(`http://localhost:3000/api/gamelist/`);
            const newGameList = await response.data;
            setGameList(newGameList);
        };
        loadGames().catch((e) => console.log(e));
    }, []);

    console.log(gameList);

    if (!gameList){
        setGameList([]);
    }

  return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>} />
                    <Route path={"/games"} element={<GameCollection gameList={gameList} setGameList={setGameList}/>} />
                    <Route path={"/games/:gameId"} element={<GameProfile gameList={gameList} setGameList={setGameList}/>} />
                    <Route path={"/addgame"} element={<AddGame/>}/>
                    <Route path={"/user"} element={<UserProfile/>} />
                    <Route path={"/games/random/:randomId"} element={<RandomGame gameList={gameList} setGameList={setGameList}/>} />
                    <Route path={"/login"} element={<LogInPage />} />
                    <Route path={"/signup"} element={<SignUpPage />} />
                    <Route path={"/addgame"} element={<AddGame gameList={gameList} setGameList={setGameList}/>} />
                </Routes>
            </BrowserRouter>
        </>
  );
}

export default App;
