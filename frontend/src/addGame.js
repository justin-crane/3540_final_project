import './App.css';
import { Link } from "react-router-dom";

export  function AddGame(){
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <h1>Add Game</h1>
            <form action="/api/addGame" method="Post" encType="multipary/form-data">
                <input
                    name="name"
                    type="text"
                    placeholder="Game Name..."
                    required
                />
                <br/>
                <input
                    name="console"
                    type="text"
                    placeholder="Console..."
                    required
                />
                <br/>
                <input
                    name="img"
                    type="file"
                    multiple="multiple"
                    required
                />
                <br/>
                <select name="conditon">
                    <option value="placeHold" disabled>Condition</option>
                    <option value="loose">Loose</option>
                    <option value="complete">Complete</option>
                    <option value="sealed">Sealed</option>
                    <option value="boxOnly">Box Only</option>
                    <option value="manOnly">Manual Only</option>
                    <option value="gameAndBox">Game + Box</option>
                    <option value="gameAndMan">Game + Manual</option>
                </select>
                <br/>
                <select name="availability">
                    <option value="placeHold" disabled>Availability</option>
                    <option value="notAvail">Not for trade</option>
                    <option value="Avail">Available for trade</option>
                </select>
                <br/>
                <input
                    name="notes"
                    type="text"
                    placeholder="Notes..."
                />
                <br/>
                <button type="submit">Add Game</button>
            </form>
        </div>
    )
}