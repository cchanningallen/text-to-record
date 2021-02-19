import Link from 'next/link';
import Button from './Button';
import { BookOpen, Plus } from './icons/outline';

export default function NavBar() {
    return (
        <nav className="flex justify-between border-b-2 p-2 w-screen bg-gray-50">
            <Link href="/">
                <Button icon transparent theme="primaryLight">
                    <BookOpen />
                </Button>
            </Link>
            <Link href="/add-record">
                <Button icon transparent theme="primaryLight">
                    <Plus />
                </Button>
            </Link>
        </nav>
    );
}
