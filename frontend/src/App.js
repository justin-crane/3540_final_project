import './App.css';
import Home from "./pages/Home";
import GameProfile from "./pages/GameProfile";
import GameCollection from "./pages/GameCollection";
import UserProfile from "./pages/UserProfile";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import RandomGame from "./pages/RandomGame";

function App() {
  //code

  return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>} />
                    <Route path={"/games"} element={<GameCollection/>} />
                    <Route path={"/games/:gameId"} element={<GameProfile/>} />
                    <Route path={"/user"} element={<UserProfile/>} />
                    <Route path={"/games/random/:randomId"} element={<RandomGame />} />
                </Routes>
            </BrowserRouter>
        </>
  );
}

export default App;
