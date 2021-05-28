import { signOut, useSession } from 'next-auth/client';
import LinkButton from './NextLinkButton';

const mainStyles =
    'flex justify-between border-t-2 px-8 py-2 w-screen bg-gray-50';

export default function Footer() {
    const [session, loading] = useSession();

    if (!session || !!loading) {
        return (
            <footer className={mainStyles}>
                <div></div>
            </footer>
        );
    }

    return (
        <footer className={mainStyles}>
            <div></div>
            <LinkButton
                href="/api/auth/signin"
                onClick={(e) => {
                    e.preventDefault();
                    signOut();
                }}
                transparent
                sm
                theme="primaryLight"
            >
                Sign Out
            </LinkButton>
        </footer>
    );
}
