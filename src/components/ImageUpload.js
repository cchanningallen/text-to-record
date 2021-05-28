import React from 'react';

export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uploading: false,
            imageInfo: null,
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <input
                    multiple={false}
                    type="file"
                    onChange={(e) => this._upload(e.target.files)}
                />
                {this.state.uploading && 'Uploading...'}
                {!!this.state.imageInfo && (
                    <img src={this.state.imageInfo.base64} />
                )}
            </div>
        );
    }

    _upload(files) {
        this.setState({ uploading: true });
        const file = files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let imageInfo = {
                name: file.name,
                type: file.type,
                size: Math.round(file.size / 1000) + ' kB',
                base64: reader.result,
                file: file,
            };
            this.setState({
                uploading: false,
                imageInfo: imageInfo,
            });
            this.props.onUpload(imageInfo);
        };
    }
}
