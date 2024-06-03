import React, { useState } from "react"
import { FaTimes } from "react-icons/fa";

import "./UserForm.css";
import { UsernameProps } from "../types/types";
import { SoundButton } from "../game/MainPage";


export const UserForm: React.FC<UsernameProps> = ({ onSubmit, onClose }) => {
    const [username, setUsername] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(username);
    };

    return(
        <>
            <div className="overlay">
                <div className="form-container">
                    <SoundButton className="close" onClick={onClose} soundType="interface-click"><FaTimes /></SoundButton>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Enter your name:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleChange}
                            required
                            minLength={3}
                            pattern="^[a-zA-Z]+$"
                        />
                        <button className="submit-form" type="submit">Start Game</button>
                    </form>
                </div>
            </div>
        </>
    )
}