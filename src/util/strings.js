function toTitleCase(str) {
    return str.replace(
        /\b\w+/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

export default { toTitleCase };
