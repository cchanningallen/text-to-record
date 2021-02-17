function toTitleCase(str) {
    return str.replace(
        /\b\w+/,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

export { toTitleCase };
