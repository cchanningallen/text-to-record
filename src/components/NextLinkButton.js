import React from 'react';
import Link from 'next/link';
import Button from './Button';

// Required to make any custom functional component (in this case, Button)
// play nicely with Next's <Link> component.
// Details: https://github.com/vercel/next.js/issues/7915#issuecomment-519786376
const LinkButton = ({ href, ...props }) => (
    <Link href={href} passHref>
        <Button {...props} />
    </Link>
);

export default LinkButton;
