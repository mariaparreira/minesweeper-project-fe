import React from 'react';
import clickSound from './click-sound.wav';
import arcadeGame from './arcade-game.wav';
import interfaceClick from './interface-click.wav';

export const CLICK_SOUND_ID = 'click-sound';
export const ARCADE_GAME_ID = 'arcade-game';
export const INTERFACE_CLICK_ID = 'interface-click';

export const SoundContainer: React.FC = () => {
    return (
        <div >
            <audio id={CLICK_SOUND_ID} src={clickSound as string} preload='auto' />
            <audio id={ARCADE_GAME_ID} src={arcadeGame as string} preload='auto' />
            <audio id={INTERFACE_CLICK_ID} src={interfaceClick as string} preload='auto' />
        </div>
    )
}
