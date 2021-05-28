import { signIn, useSession } from 'next-auth/client';
import LinkButton from './NextLinkButton';
import { BookOpen, Plus } from './icons/outline';

const mainStyles =
    'flex justify-between border-b-2 py-2 px-8 w-screen bg-gray-50';

export default function NavBar() {
    const [session, loading] = useSession();

    if (!!loading) {
        return (
            <nav className={mainStyles}>
                <LinkButton href="/" icon transparent theme="primaryLight">
                    <BookOpen />
                </LinkButton>
            </nav>
        );
    }

    if (!session) {
        return (
            <nav className={mainStyles}>
                <LinkButton href="/" icon transparent theme="primaryLight">
                    <BookOpen />
                </LinkButton>
                <LinkButton
                    href="/api/auth/signin"
                    onClick={(e) => {
                        e.preventDefault();
                        signIn();
                    }}
                    transparent
                    sm
                    theme="primaryLight"
                >
                    Sign In
                </LinkButton>
            </nav>
        );
    }

    return (
        <nav className={mainStyles}>
            <LinkButton href="/" icon transparent theme="primaryLight">
                <BookOpen />
            </LinkButton>
            <div>
                <LinkButton
                    href="/add-record"
                    icon
                    transparent
                    theme="primaryLight"
                >
                    <Plus />
                </LinkButton>
            </div>
        </nav>
    );
}
