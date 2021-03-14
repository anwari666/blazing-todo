import Link from 'next/link'

const App = () => {
    return (
        <>
            <h1> Welcome to the static page for todolist! </h1>
            <Link href="/firstlist">
                <a>Go check the first list</a>
            </Link>
            <br />
            <Link href="/about">
                <a>About</a>
            </Link>
        </>
    )
}

export default App