import React, {useEffect, useState} from 'react';
import Webcamera from 'src/components/WebCamera';
import { clipImage } from 'src/utils/faceUtils/getImageData';
import faceapi, { getDetectorOptions, isModelLoaded, loadModel } from 'src/utils/faceUtils/faceDetectionControl';
import {grayPocess} from 'src/utils/faceUtils/grayProcess';
import histogramEqualize from 'src/utils/faceUtils/histogramEqualize';
import request from 'src/utils/request';
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

const scaleImage = imageData => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);
        const imgUrl = canvas.toDataURL('image/png');
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, 30, 30);
            resolve(ctx.getImageData(0, 0, 30, 30));
        };
        image.src = imgUrl;
        image.onerror = e => {
            reject(e);
        };
    });
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
        const faceImageData = await scaleImage(imageScreenShot);
        const faceData = histogramEqualize(grayPocess(faceImageData).grayMatrix);
        request.post('/api/detect', {
            faceData,
        }).then(res => {
            console.log(res, 'detect');
        });

        const dims = faceapi.matchDimensions(canvas, webCameraRef.current, true);
        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(result, dims));
        webCameraRef.current.pause();
    }

    setTimeout(() => onPlayMark());
};

export default function IndexPage() {
    const [isUsingCamera, setIsUsingCamera] = useState(false);

    useEffect(() => {
        if (isUsingCamera) {
            appendOverlay();
            loadModel();
            webCameraRef.current && webCameraRef.current.paused
                ? webCameraRef.current.play() : void 0;
            
        }
        return () => {
            webCameraRef.current && webCameraRef.current.pause();
            removeOverlay();
        };
    });

    return (
        <div className='index-page'>
            <div className="form-wrap">
                <Form
                    onChange={(value) => {
                        console.log(value);
                    }}
                >
                    <Row>
                        <Col span={9} offset={2}>
                            <Form.Item name="detectionclass" label="选择班级">
                                <Select
                                    allowClear
                                >
                                    <Select.Option value="computer162">计算机162班</Select.Option>
                                    <Select.Option value="computer163">计算机163班</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={9} offset={2}>
                            <Form.Item name="activename" label="签到场次">
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
