import React, {useEffect} from 'react';
import './style.less';

const initStream = () => {
    const videoEl = document.querySelector('#web-camera-video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then(userStream => {
        videoEl.srcObject = userStream;
    }).catch(err => {
        console.error(`getUserMedia: fail! error:${err}`);
    });
};

const initWidth = props => {
    const { width = 640 } = props;
    let streaming = false;
    const videoEl = document.querySelector('#web-camera-video');
    videoEl.addEventListener('canplay', function(){
        if (!streaming) {
            const height = videoEl.videoHeight / (videoEl.videoWidth/width);
            videoEl.setAttribute('width', width);
            videoEl.setAttribute('height', height);
            streaming = true;
        }
    }, false);
};

const WebCamera = (props, ref) => {
    useEffect(() => {
        // didMounted时调用
        initStream(props);
        document.querySelector('#web-camera-video').play();
    }, []);

    useEffect(() => {
        initWidth(props);
    });

    const { onLoadedMetaData } = props;
    return (
        <div className='web-camera-container'>
            <video id="web-camera-video" ref={ref} onLoadedMetadata={onLoadedMetaData}>video stream not avalibe!</video>
        </div>
    );
};

export default React.forwardRef(WebCamera);

