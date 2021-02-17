import React from 'react';
import { recordTypes } from '../constants';
import { toTitleCase } from '../util/strings';
import RecordTimeline from '../components/RecordTimeline';
import Button from '../components/Button';

const TYPE_OPTIONS = [
    '', // == unselected
    ...Object.keys(recordTypes).map((k) => recordTypes[k]),
];

export default class RecordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            type: '',
            createdAt: '',
            text: '',
        };
    }

    render() {
        return (
            <div className="max-w-md w-full bg-white p-4">
                {this._renderHeader()}
                {this._renderTitleInput()}
                {this._renderTypeInput()}
                {this._renderCreatedAtInput()}
                {this._renderTextInput()}
                {this._renderPreview()}
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

    _renderTitleInput() {
        return (
            <label className="block mb-4">
                <span className="text-gray-700">Title</span>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    value={this.state.title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                />
            </label>
        );
    }

    _renderTypeInput() {
        return (
            <label className="block mb-4">
                <span className="text-gray-700">Type</span>
                <select
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    value={this.state.type}
                    onChange={(e) => this.setState({ type: e.target.value })}
                >
                    {TYPE_OPTIONS.map((value, i) => (
                        <option key={i} value={value}>
                            {toTitleCase(value)}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    _renderCreatedAtInput() {
        return (
            <label className="block mb-4">
                <span className="text-gray-700">Created At (Override)</span>
                <input
                    type="datetime-local"
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    value={this.state.createdAt}
                    onChange={(e) =>
                        this.setState({ createdAt: e.target.value })
                    }
                />
            </label>
        );
    }

    _renderTextInput() {
        return (
            <label className="block mb-8">
                <span className="text-gray-700">Details</span>
                <textarea
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                    rows="3"
                    value={this.state.text}
                    onChange={(e) => this.setState({ text: e.target.value })}
                />
            </label>
        );
    }

    _renderPreview() {
        return (
            <div className="mb-8">
                <div className="border mt-8 mb-4" />
                <div className="flex justify-center mb-4">
                    <h1 className="text-lg font-semibold">{'Preview'}</h1>
                </div>
                <RecordTimeline
                    records={[
                        {
                            ...this.state,
                            id: '1', // for key
                            createdAt: this.state.createdAt || undefined, // simulate db-timestamped createdAt
                        },
                    ]}
                />
                <div className="border mt-4 mb-8" />
            </div>
        );
    }

    _renderSubmit() {
        return (
            <Button
                disabled={this._isDisabled()}
                className="w-full"
                onClick={this._submit}
            >
                Create
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
        return !this.state.title || !this.state.type;
    }

    _getFormData() {
        return {
            ...this.state,
            raw: '', // Indicates this record was not derived from an SMS.
        };
    }
}
