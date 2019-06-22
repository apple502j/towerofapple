import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import styles from './record-stage.css';

const messages = defineMessages({
    duration: {
        defaultMessage: 'Duration',
        description: 'Label of slider of duration of recording',
        id: 'gui.recordStage.duration'
    },
    options: {
        defaultMessage: 'Options',
        description: 'Label of options field',
        id: 'gui.recordStage.options'
    },
    stage: {
        defaultMessage: 'Current Stage:',
        description: 'Label of a picture of current stage',
        id: 'gui.recordStage.stage'
    },
    title: {
        defaultMessage: 'Record Project Video',
        description: 'Title of stage recorder modal',
        id: 'gui.recordStage.title'
    }
});

const RecordStageComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="recordStage"
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                {props.intl.formatMessage(messages.duration)}
            </Box>
            <Box>
                <input
                    className={styles.duration}
                    max={60}
                    min={5}
                    step={1}
                    type="slider"
                    value={props.duration}
                    onChange={props.onChangeDuration}
                />
            </Box>
            <Box className={styles.label}>
                {props.intl.formatMessage(messages.options)}
            </Box>
            <Box className={styles.optionsRow}>
                <Box className={styles.cameraOption}>
                    <label>
                        <input
                            checked={props.noCameraSelected}
                            type="checkbox"
                            onChange={props.onCameraOptionChange}
                        />
                        <FormattedMessage
                            defaultMessage="Turn off your camera"
                            description="Option to turn off camera (video sensing)"
                            id="gui.recordStage.noCamera"
                        />
                    </label>
                </Box>
                <Box className={styles.soundOption}>
                    <label>
                        <input
                            checked={props.soundSelected}
                            type="checkbox"
                            onChange={props.onSoundOptionChange}
                        />
                        <FormattedMessage
                            defaultMessage="Add sounds"
                            description="Option to add sounds to the video"
                            id="gui.recordStage.addSound"
                        />
                    </label>
                </Box>
            </Box>
            <Box className={styles.label}>
                {/* eslint-disable max-len */}
                <FormattedMessage
                    defaultMessage="When you press Stop button or the time has come, a WebM file will be downloaded. You can open the video with your browser."
                    description="Message that describes what will happen after clicking Start"
                    id="gui.recordStage.notes"
                />
                {/* eslint-enable max-len */}
            </Box>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.recordStage.cancel"
                    />
                </button>
                <button
                    className={styles.startButton}
                    onClick={props.onStart}
                >
                    <FormattedMessage
                        defaultMessage="Start"
                        description="Button in prompt for starting recording"
                        id="gui.recordStage.start"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

RecordStageComponent.propTypes = {
    duration: PropTypes.number.isRequired,
    intl: intlShape,
    noCameraSelected: PropTypes.bool.isRequired,
    onCameraOptionChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeDuration: PropTypes.func.isRequired,
    onSoundOptionChange: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    soundSelected: PropTypes.bool.isRequired
};

export default injectIntl(RecordStageComponent);
