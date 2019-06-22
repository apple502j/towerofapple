import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import RecordStageComponent from '../components/record-stage/record-stage.jsx';
import StageRecorder from '../lib/stage-recorder';
import downloadBlob from '../lib/download-blob';

class RecordStage extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleStart',
            'handleCancel',
            'handleCameraOptionChange',
            'handleChangeDuration',
            'handleSoundOptionChange',
            'handleStop'
        ]);
        this.state = {
            noCameraSelected: true,
            duration: 30,
            soundSelected: true
        };
        this.recorder = new StageRecorder(this.props.vm);
    }
    handleChangeDuration (e) {
        this.setState({duration: e.target.value});
    }
    handleStart () {
        this.recorder.start(this.state.duration, {
            noCamera: this.state.noCameraSelected,
            addSound: this.state.soundSelected
        });
        this.props.vm.runtime.on('RECORDING_FINISHED', this.handleStop);
        this.props.onHide();
    }
    handleStop (blob) {
        downloadBlob('stage.webm', blob);
    }
    handleCancel () {
        this.props.onHide();
    }
    handleCameraOptionChange (e) {
        this.setState({noCameraSelected: e.target.checked});
    }
    handleSoundOptionChange (e) {
        this.setState({soundSelected: e.target.checked});
    }
    render () {
        return (
            <RecordStageComponent
                duration={this.state.duration}
                noCameraSelected={this.state.noCameraSelected}
                soundSelected={this.state.soundSelected}
                onCameraOptionChange={this.handleCameraOptionChange}
                onCancel={this.handleCancel}
                onChangeDuration={this.handleChangeDuration}
                onSoundOptionChange={this.handleSoundOptionChange}
                onStart={this.handleStart}
            />
        );
    }
}

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line no-unused-vars

RecordStage.propTypes = {
    onHide: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RecordStage);
