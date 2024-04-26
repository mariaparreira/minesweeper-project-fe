import React from 'react';
import { withSound, WithSoundProps } from '../sound/withSound';
import { SoundContainer } from '../sound/SoundContainer';
import './MainPage.css';
import '../styles.css';
import { MinesweeperGame } from './MinesweeperGame';

const SoundButton = withSound((props: React.ButtonHTMLAttributes<HTMLButtonElement> & WithSoundProps) => (
    <button {...props} />
));

export const MainPage = () => {
    return (
        <>
            <SoundContainer />
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            <div className='choose-level'>
                <SoundButton className='level' onClick={() => console.log('Easy clicked')}>Easy</SoundButton>
                <SoundButton className='level' onClick={() => console.log('Medium clicked')}>Medium</SoundButton>
                <SoundButton className='level' onClick={() => console.log('Hard clicked')}>Hard</SoundButton>
            </div>
            <MinesweeperGame />
        </>
    );
};
