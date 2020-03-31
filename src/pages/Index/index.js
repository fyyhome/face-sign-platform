import React, {useEffect, useState} from 'react';
import Webcamera from 'src/components/WebCamera';
import { initCanvas } from 'src/utils/faceUtils/getImageData';
import faceapi, { getDetectorOptions, isModelLoaded, loadModel } from 'src/utils/faceUtils/faceDetectionControl';
import './style.less';
import { Form, Select, Button, Input, Row, Col } from 'antd';

const webCameraRef = React.createRef();
const overlayCanvasId = 'overlay-mark';

const appendOverlay = () => {
    let canvas = document.querySelector(`#${overlayCanvasId}`);
    if (canvas) {
        return;
    }
    canvas = document.createElement('canvas');
    canvas.id = overlayCanvasId;
    // 画布宽度设置无效
    canvas.style = 'position: absolute; top: 0; left: 0;';
    webCameraRef.current.parentNode.insertBefore(canvas, webCameraRef.current);
};

const removeOverlay = () => {
    const canvas = document.querySelector(`#${overlayCanvasId}`);
    if (canvas) {
        canvas.remove();
    }
};

const clipImage = (videoEl, faceDetectionBox) => {
    const { x, y, width, height } = faceDetectionBox;
    const ctx = initCanvas().getContext('2d');
    ctx.drawImage(videoEl, x, y, width, height, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
};

const onPlayMark = async () => {
    if (!isModelLoaded() || !webCameraRef.current || webCameraRef.current.paused || webCameraRef.current.ended) {
        return setTimeout(() => onPlayMark());
    }

    const options = getDetectorOptions();
    const result = await faceapi.detectSingleFace(webCameraRef.current, options);
    const canvas = document.querySelector(`#${overlayCanvasId}`);

    if (result && canvas) {
        const box = result.box;
        const imageScreenShot = clipImage(webCameraRef.current, box);
        // TODO
        console.log(imageScreenShot, '处理图像信息');

        const dims = faceapi.matchDimensions(canvas, webCameraRef.current, true);
        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims));
    }

    setTimeout(() => onPlayMark());
};

export default function IndexPage() {
    const [isUsingCamera, setIsUsingCamera] = useState(false);

    useEffect(() => {
        if (isUsingCamera) {
            appendOverlay();
            loadModel();
            return () => removeOverlay();
        }
    });

    return (
        <div className='index-page'>
            <div className="form-wrap">
                <Form>
                    <Row>
                        <Col span={9} offset={2}>
                            <Form.Item name="detectionClass" label="选择班级">
                                <Select
                                    allowClear
                                    onChange={(value) => {
                                        console.log(value);
                                    }}
                                >
                                    <Select.Option value="computer162">计算机162班</Select.Option>
                                    <Select.Option value="computer163">计算机163班</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={9} offset={2}>
                            <Form.Item name="signName" label="签到场次">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Form>
                    <Form.Item wrapperCol={{
                        offset: 10
                    }}>
                        <Button htmlType="button" onClick={() => {
                            setIsUsingCamera(!isUsingCamera);
                        }}>
                            开始识别
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="web-camera-wrap">
                {isUsingCamera ? (<Webcamera ref={webCameraRef} onLoadedMetaData={e => onPlayMark(e)} />) : null}
            </div>
        </div>
    );
}
