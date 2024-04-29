import React from 'react';
import clickSound from './click-sound.wav';
import arcadeGame from './mixkit-arcade-game-jump-coin-216.wav';

export const CLICK_SOUND_ID = 'click-sound';
export const ARCADE_GAME_ID = 'arcade-game';

export const SoundContainer: React.FC = () => {
    return (
        <div >
            <audio id={CLICK_SOUND_ID} src={clickSound as string} />
            <audio id={ARCADE_GAME_ID} src={arcadeGame as string} />
        </div>
    )
}
