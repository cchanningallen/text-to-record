import { signIn } from 'next-auth/client';
import Button from './Button';

export default function SignIn(props) {
    return (
        <div className="text-center p-16 bg-white max-w-md w-full rounded">
            <h1 className="text-xl font-semibold mb-2">
                👋&nbsp;&nbsp;Welcome!
            </h1>
            <p className="mb-8">Please sign in to get started 🚀</p>
            <Button
                className="w-40"
                // href="/api/auth/signin"
                onClick={(e) => {
                    e.preventDefault();
                    signIn();
                }}
            >
                Sign In
            </Button>
        </div>
    );
}
