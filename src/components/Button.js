// TODO: This pattern feels clunky. Consider refactoring.
const styles = {
    base: () => `font-bold focus:outline-none focus:shadow-outline`,
    normal: () => `px-4 py-2 rounded`,
    icon: () => `p-1 rounded-full w-8 h-8`,
    solid: ({ color, colorDarker }) =>
        `bg-${color} hover:bg-${colorDarker} text-white`,
    transparent: ({ color, colorDarker }) =>
        `bg-transparent border-2 border-${color} hover:border-${colorDarker} text-${color} hover:text-${colorDarker}`,
    disabled: () => `opacity-30 pointer-events-none`,
};

const themes = {
    primary: {
        color: 'indigo-600',
        colorDarker: 'indigo-800',
    },
    primaryLight: {
        color: 'indigo-400',
        colorDarker: 'indigo-600',
    },
};

export default function Button({
    className,
    onClick,
    disabled,
    icon,
    transparent,
    theme,
    children,
}) {
    // initialize base classnames
    const classNames = [styles.base()];

    // disabled
    if (disabled) {
        classNames.push(styles.disabled());
    }

    // color theming
    let colorProps = themes.primary;
    if (theme) {
        colorProps = themes[theme];
    }
    if (transparent) {
        classNames.push(styles.transparent(colorProps));
    } else {
        classNames.push(styles.solid(colorProps));
    }

    // icon (circle) vs normal (rectangle)
    if (icon) {
        classNames.push(styles.icon());
    } else {
        classNames.push(styles.normal());
    }

    // custom classnames from props
    if (className) {
        classNames.push(className);
    }

    return (
        <button
            className={classNames.join(' ')}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
