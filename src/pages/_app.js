import Link from 'next/link';
import Button from '../components/Button';
import { Home, Plus } from '../components/icons';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <div>
            <NavBar className="z-30 fixed" />
            {/* 
            HACK: Render a display:block copy of NavBar to ensure page content renders
            immediately beneath the fixed NavBar 
            */}
            <NavBar />
            <Component {...pageProps} />
        </div>
    );
}

function NavBar({ className }) {
    return (
        <nav
            className={`flex justify-between border-b-2 p-2 w-screen bg-gray-50 ${className}`}
        >
            <Link href="/">
                <Button icon theme="primaryTransparent">
                    <Home />
                </Button>
            </Link>
            <Link href="/add-record">
                <Button icon theme="primaryTransparent">
                    <Plus />
                </Button>
            </Link>
        </nav>
    );
}
