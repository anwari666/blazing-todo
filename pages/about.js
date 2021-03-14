import Link from 'next/link'

const Page = () => {
    return (
        <>
            <h1> About this project! </h1>
            <p> This is a pet project by Anwari, just to serve as a practice of React, Next, Apollo, GraphQL and react-testing-library.</p>
            <Link href="/">
                <a>Go home</a>
            </Link>
        </>
    )
}

export default Page