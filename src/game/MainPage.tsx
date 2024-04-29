import React, { useState } from 'react';
import { withSound, WithSoundProps } from '../sound/withSound';
import { SoundContainer } from '../sound/SoundContainer';
import './MainPage.css';
import '../styles.css';
import { MinesweeperGame } from './MinesweeperGame';
import { Minesweeper } from '../types/types';

// Define a new type that extends the Minesweeper type to include gridClass
type MinesweeperConfig = Minesweeper & { gridClass: string };

const SoundButton = withSound((props: React.ButtonHTMLAttributes<HTMLButtonElement> & WithSoundProps) => (
    <button {...props} />
));

export const MainPage = () => {
    const [minesweeperConfig, setMinesweeperConfig] = useState<MinesweeperConfig | null>(null);

    const handleDifficultyClick = (rows: number, columns: number, mines: number, gridClass: string) => {
        setMinesweeperConfig({ rows, columns, mines, gridClass }); // Set the difficulty configuration
    };

    return (
        <>
            <SoundContainer />
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            <div className='choose-level'>
                <SoundButton className='level' onClick={() => handleDifficultyClick(8, 8, 10, 'easy-grid')} soundType='click-sound'>Easy</SoundButton>
                <SoundButton className='level' onClick={() => handleDifficultyClick(16, 16, 40, 'medium-grid')} soundType='click-sound'>Medium</SoundButton>
                <SoundButton className='level' onClick={() => handleDifficultyClick(30, 16, 99, 'hard-grid')} soundType='click-sound'>Hard</SoundButton>
            </div>
            { minesweeperConfig !== null && <MinesweeperGame minesweeperConfig={minesweeperConfig} /> }
        </>
    );
};
