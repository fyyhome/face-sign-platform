import React, { useState } from 'react';
import { Form, Row, Col, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { clipImage } from 'src/utils/faceUtils/getImageData';
import { grayPocess } from 'src/utils/faceUtils/grayProcess';
import faceapi, {isModelLoaded, loadModel, getDetectorOptions} from 'src/utils/faceUtils/faceDetectionControl';
import histogramEqualize from 'src/utils/faceUtils/histogramEqualize';
import request from 'src/utils/request';

const fileMatrixs = [];

const getFacePart = async (img, cb) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!isModelLoaded()) {
        await loadModel();
    }
    const result = await faceapi.detectSingleFace(img, getDetectorOptions());
    console.log(result, 'detect result');
    if (result) {
        canvas.width = result.box.width;
        canvas.height = result.box.height;
        const facePartImageData = clipImage(img, result.box);
        ctx.putImageData(facePartImageData, 0, 0);
        const imageUrl = canvas.toDataURL('image/png');

        // const imgEl = document.createElement('img');
        // imgEl.src = imageUrl;
        // document.querySelector('.data-entry').appendChild(imgEl);
        
        // 缩放照片
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, 30, 30);
            const scaleData = ctx.getImageData(0, 0, 30, 30);
            cb(scaleData);
        };
        image.src = imageUrl;
    }
};

export default function DataEntryPage() {
    const [fileList, setFileList] = useState([]);

    const onFinish = values => {
        const params = {
            ...values,
            faceData: fileMatrixs
        };
        request.post('/api/addStudent', params).then(res => {
            fileMatrixs.splice(0, fileMatrixs.length);
            setFileList([]);
            console.log(res);
        });
    };

    const uploadProps = {
        beforeUpload: file => {
            const fileUrl = window.URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setFileList([...fileList, file]);
                getFacePart(img, imageData => {
                    const {grayMatrix} = grayPocess(imageData);
                    const hgEqualizeMatrix = histogramEqualize(grayMatrix);
                    fileMatrixs.push(hgEqualizeMatrix);
                    console.log(fileMatrixs, 'beforeUpload');
                });
            };
            img.onerror = err => {
                console.warn(err);
            };
            img.src = fileUrl;
            return false;
        },
        onRemove: file => {
            const index = fileList.findIndex(item => item === file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList([...newFileList]);
            fileMatrixs.splice(index, 1);
        },
        fileList,
    };

    return (
        <div className='data-entry'>
            <Form style={
                {
                    margin: '20px auto'
                }
            }
                onFinish={onFinish}
            >
                <Row>
                    <Col span="12" offset="6">
                        <Form.Item name="stuName" label="姓名">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" offset="6">
                        <Form.Item name="stuNumber" label="学号">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" offset="6">
                        <Form.Item name="classNumber" label="班级">
                            <Select>
                                <Select.Option value="computer162">计算机162班</Select.Option>
                                <Select.Option value="computer163">计算机163班</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" offset="6">
                        <Form.Item label="照片">
                            <Upload {...uploadProps}>
                                <Button>
                                    <UploadOutlined />点击上传
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="2" offset="11">
                        <Form.Item>
                            <Button htmlType="submit" type="primary">提交</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
