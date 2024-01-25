import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Button, Space, Upload } from 'antd';
import '../styles/Layout.css'

const { TextArea } = Input;
const ModelCardHetero = (props) => {

    // const [formData, setFormData] = useState({task:'', method:'', host:'', scheme:''})
    const handleSchemeChange = (value) => {
        props.onSelectScheme(value);
    }

    const [form] = Form.useForm();
    let formData = {}
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };
    const onFormLayoutChange = () => {
        let fieldVals = form.getFieldsValue()
        props.onChangeData({ modelData: { ...fieldVals } })

    }

    const onFinish = (val) => {
        console.log('on finish ', val)
    }
    // handleChange = e => {
    //     // Use e.target.name as the computed property name, 
    //     // so it can be used for infinite number of inputs
    //     this.setState({[e.target.name]: e.target.value});
    //   };
    return (

        <Card title="Models Overview"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)", marginTop: '10px', marginBottom: '10px' }}>

            <Form form={form} labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onValuesChange={onFormLayoutChange}
                style={{ width: '90%' }}>

                <Form.Item
                    label="Models Overview"
                    name="modelOverview"
                    rules={[{ required: false }]}
                >
                    <TextArea rows={4} />
                    {/* <Input /> */}
                </Form.Item>

                <Form.Item label="Representation Model File">
                    <Form.Item name="repModel" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="files" customRequest={dummyRequest}
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Extractor Model File">
                    <Form.Item name="extModel" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <Upload.Dragger name="files" customRequest={dummyRequest}
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
{/* 
                <Form.Item
                    label="Enter the Host IP"
                    name="host"
                    rules={[{ required: true, message: 'Host IP is required' }]}
                >
                    <Input placeholder="Host IP is required" />
                </Form.Item> */}

                {/* <Form.List name="clients">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Space
                                    key={field.key}
                                    style={{ display: "flex", marginBottom: 8, marginLeft: 8 }}
                                    align="baseline"
                                >
                                    <div>Client IP</div>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "client_ip"]}
                                    >
                                        <Input style={{ width: '200px' }} placeholder="Client IP" />
                                    </Form.Item>
                                    <MinusCircleOutlined style={{ fontSize: '16px', color: '#f54542' }} onClick={() => remove(field.name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Client
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List> */}
            </Form>
        </Card>



    )
}

export default ModelCardHetero;