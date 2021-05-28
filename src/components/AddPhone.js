import { useState } from 'react';
import TextInput from './TextInput';
import Button from './Button';
import requests from '../util/requests';
import cn from 'classnames';

export default function AddPhone({ userID, onComplete }) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = () => {
        const formattedPhone = '+1' + phone;
        setLoading(true);
        requests
            .put('/api/update-user', {
                body: JSON.stringify({ id: userID, phone: formattedPhone }),
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
    };

    return (
        <div
            className={cn(
                'p-16 bg-white max-w-md w-full rounded flex flex-col',
                {
                    'opacity-70 pointer-events-none': loading,
                }
            )}
        >
            <h1 className="text-xl font-semibold mb-8 text-center">
                📲&nbsp;&nbsp;Add your phone number
            </h1>
            <TextInput
                type="tel"
                className="p-2 mb-12 text-3xl font-semibold tracking-widest text-center"
                value={phone}
                onChange={(phone) => setPhone(phone)}
            />
            <Button
                loading={loading}
                disabled={phone.length !== 10}
                onClick={submit}
            >
                Submit
            </Button>
        </div>
    );
}
