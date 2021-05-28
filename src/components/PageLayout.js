import cn from 'classnames';

export default function PageLayout({ children, className, simple }) {
    if (simple) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center px-4 py-16 min-h-screen',
                    className
                )}
            >
                {children}
            </div>
        );
    }

    return (
        <div className={cn('flex justify-center px-4 min-h-screen', className)}>
            {children}
        </div>
    );
}
