import { Link } from 'react-router-dom';
import '../styles.css';

function MainPage() {
    return (
        <>
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            <div className='choose-level'>
                <Link to='/easy' className='level'>Easy</Link>
                <Link to='/medium' className='level'>Medium</Link>
                <Link to='/hard' className='level'>Hard</Link>
            </div>
        </>
    )
}

export default MainPage;