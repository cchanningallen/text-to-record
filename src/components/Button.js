// TODO: This pattern feels clunky. Consider refactoring.
const styles = {
    base: 'font-bold focus:outline-none focus:shadow-outline',
    normal: 'px-4 py-2 rounded',
    icon: 'p-1 rounded-full w-8 h-8',
    primary: 'bg-indigo-600 hover:bg-indigo-800 text-white',
    primaryTransparent:
        'bg-transparent border-2 border-indigo-600 hover:border-indigo-800 text-indigo-600 hover:text-indigo-800',
    disabled: 'opacity-30 pointer-events-none',
};

export default function Button({
    className,
    onClick,
    disabled,
    icon,
    theme,
    children,
}) {
    const classes = [styles.base];
    if (disabled) {
        classes.push(styles.disabled);
    }
    if (theme) {
        classes.push(styles[theme]);
    } else {
        classes.push(styles.primary);
    }
    if (icon) {
        classes.push(styles.icon);
    } else {
        classes.push(styles.normal);
    }
    if (className) {
        classes.push(className);
    }

    return (
        <button
            className="bg-transparent border-indigo-600"
            disabled={disabled}
            className={classes.join(' ')}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
