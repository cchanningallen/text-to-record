import React from 'react';
import cn from 'classnames';

const FORMATTERS = {
    phone: {
        parse: (val) => {
            return val.replace(/[^0-9.]/g, '');
        },
        validate: (val) => {
            if (val === '') return true;
            if (val.length > 10) return false;

            return true;
        },
        display: (val) => {
            const part1 = val.slice(0, 3);
            const part2 = val.slice(3, 6);
            const part3 = val.slice(6);

            if (part3) return [part1, part2, part3].join('-');
            if (part2) return [part1, part2].join('-');
            return part1;
        },
    },
    text: {
        parse: (val) => {
            return val;
        },
        validate: (val) => {
            return true;
        },
        display: (val) => {
            return val;
        },
    },
};

class TextInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || '',
        };
    }

    render() {
        return (
            <input
                type={this.props.type}
                className={cn(
                    'mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0',
                    this.props.className
                )}
                value={this._display(this.state.value)}
                onChange={this._handleChange}
            />
        );
    }

    _handleChange = (e) => {
        const inputValue = e.target.value;
        const value = this._parse(inputValue);
        if (!this._validate(value)) return;

        this.setState({ value });
        this.props.onChange && this.props.onChange(value);
    };

    _parse(val) {
        return this._getFormatter().parse(val);
    }

    _validate(val) {
        return this._getFormatter().validate(val);
    }

    _display(val) {
        return this._getFormatter().display(val);
    }

    _getFormatter() {
        switch (this.props.type) {
            case 'tel':
                return FORMATTERS.phone;
            case 'text':
            default:
                return FORMATTERS.text;
        }
    }
}

export default TextInput;
