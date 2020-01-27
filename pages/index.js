import Link from 'next/link'

export default () => {
    
    return (
        <>
            <h1> Welcome to the static page for todolist! </h1>
            <Link href="/firstlist">Go check the first list</Link>
        </>
    )
}
