import { Cog } from './icons/outline';

export default function Loader({ className, ...props }) {
    const styles = `animate-spin text-indigo-400 ${className}`;

    return <Cog className={styles} {...props} />;
}
