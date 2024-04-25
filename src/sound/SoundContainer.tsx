import clickSound from './click-sound.wav';

export const CLICK_SOUND_ID = 'click-sound';

export const SoundContainer: React.FC = () => {
    return (
        <div >
            <audio id={CLICK_SOUND_ID} src={clickSound as string} />
        </div>
    )
}
