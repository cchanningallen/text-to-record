import React from 'react';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

export default class TestSMSForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            from: '',
            sms: '',
        };
    }

    render() {
        return (
            <div className="max-w-md w-full bg-white p-4">
                {this._renderHeader()}
                {this._renderFromInput()}
                {this._renderSMSInput()}
                {this._renderSubmit()}
            </div>
        );
    }

    _renderHeader() {
        return (
            <div className="flex justify-center">
                <h1 className="text-xl font-semibold mb-4">
                    {this.props.headerText}
                </h1>
            </div>
        );
    }

    _renderFromInput() {
        return (
            <label className="block mb-4">
                <span className="text-gray-700">From</span>
                <TextInput
                    type="tel"
                    value={this.state.from}
                    onChange={(from) => this.setState({ from })}
                />
            </label>
        );
    }

    _renderSMSInput() {
        return (
            <label className="block mb-8">
                <span className="text-gray-700">SMS</span>
                <textarea
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    rows="3"
                    value={this.state.sms}
                    onChange={(e) => this.setState({ sms: e.target.value })}
                />
            </label>
        );
    }

    _renderSubmit() {
        return (
            <Button
                disabled={this._isDisabled()}
                loading={this.props.loading}
                className="w-full"
                onClick={this._submit}
            >
                Send
            </Button>
        );
    }

    // actions

    _submit = () => {
        if (this._isDisabled()) {
            return;
        }

        this.props.onSubmit(this._getFormData());
    };

    // helpers

    _isDisabled() {
        return (
            !this.state.from || this.state.from.length != 10 || !this.state.sms
        );
    }

    _getFormData() {
        return {
            From: '+1' + this.state.from,
            Body: this.state.sms,
        };
    }
}
