import React from "react";
import { CLICK_SOUND_ID, ARCADE_GAME_ID } from "./SoundContainer";

export interface WithSoundProps {
    soundType: 'click-sound' | 'arcade-game',
    onClick: () => void,
};

export function withSound<P extends WithSoundProps>(Component: React.FC<P>): React.FC<P> {
    const ButtonWithSound: React.FC<P> = ({ soundType, onClick, ...props}) => {
        const handleClick = () => {
            const soundId = soundType === 'click-sound' ? CLICK_SOUND_ID : ARCADE_GAME_ID;
            const audioElement = document.getElementById(soundId) as HTMLAudioElement | null;

            if (audioElement) audioElement.play();

            onClick();
        };

        return <Component {...props as P} onClick={handleClick} />;
    };

    return ButtonWithSound;
}
