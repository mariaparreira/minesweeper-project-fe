import { FaTimes } from 'react-icons/fa';

import { LeaderboardProps } from "../types/types";
import "./Leaderboard.css";
import { SoundDiv } from './MinesweeperGame';
import { SoundButton } from './MainPage';

export const Leaderboard: React.FC<LeaderboardProps> = ({ data, level, onLevelChange, onClose }) => {
    return(
        <>
            <div className="containing">
                <div className="container">
                    <div className="leaderboard">
                        <div className="level-select">
                            <SoundDiv className={`choose ${level === 'easy' ? 'active' : ''}`} onClick={() => onLevelChange("easy")} soundType="interface-click">Easy</SoundDiv>
                            <SoundDiv className={`choose ${level === 'medium' ? 'active' : ''}`} onClick={() => onLevelChange("medium")} soundType="interface-click">Medium</SoundDiv>
                            <SoundDiv className={`choose ${level === 'expert' ? 'active' : ''}`} onClick={() => onLevelChange("expert")} soundType="interface-click">Expert</SoundDiv>
                        </div>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{entry.playerName}</td>
                                        <td>{entry.time}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <SoundButton className="close-button" onClick={onClose} soundType="interface-click"><FaTimes /></SoundButton>
                </div>
            </div>
        </>
    )
}
