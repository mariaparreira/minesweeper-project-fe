import '../styles/MainPage.css'

function MainPage() {
    return (
        <>
            <h1>M<b className='ines-style'>ines</b>weeper</h1>
            <div className='choose-level'>
                <button className='level'>Easy</button>
                <button className='level'>Medium</button>
                <button className='level'>Hard</button>
            </div>
        </>
    )
}

export default MainPage;