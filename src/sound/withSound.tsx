import React from "react";
import { CLICK_SOUND_ID } from "./SoundContainer";

export interface WithSoundProps {
    onClick: () => void,
};

export function withSound<P extends WithSoundProps>(Component: React.FC<P>): React.FC<P> {
    const ButtonWithSound: React.FC<P> = ({ onClick, ...props}) => {
        const handleHover = () => {
            const audioElement = document.getElementById(CLICK_SOUND_ID) as HTMLAudioElement | null;

            if (audioElement) audioElement.play();

            onClick();
        };

        return <Component {...props as P} onClick={handleHover} />;
    };

    return ButtonWithSound;
}
