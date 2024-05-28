import { FaTimes } from 'react-icons/fa';

import { LeaderboardProps } from "../types/types";
import "./Leaderboard.css";
import { SoundButton } from './MainPage';

export const Leaderboard: React.FC<LeaderboardProps> = ({ data, onClose }) => {
    return(
        <>
            <div className="container">
                <div className="leaderboard">
                    {data.map((entry, index) => (
                        <div className="row" key={index}>
                            <div className="counter">{index + 1}</div>
                            <div className="username">{entry.playerName}</div>
                            <div className="time">{entry.time}s</div>
                        </div>
                    ))}
                </div>
                <SoundButton className="close-button" onClick={onClose} soundType="arcade-game"><FaTimes /></SoundButton>
            </div>
        </>
    )
}
