import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Button, Row, Col } from 'antd';
import '../styles/Layout.css'



const DatasetCard = (props) => {

    const [dtype, setdtype] = useState(null)
    const [form] = Form.useForm();
    const onFormLayoutChange = () => {

        let fieldVals = form.getFieldsValue()
        props.onChangeData({ preprocessing: { ...fieldVals } })
        // props.set
        // props.genData = {...fieldVals}
        // console.log('fields ' , fieldVals)
    }

    return (

        <Card title="Dataset Parameters"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)", marginTop: '10px', marginBottom: '10px' }}>
            <Row>
                <Col span={12}>
                    <Card
                        headStyle={{ fontWeight: 800, fontSize: 24 }}
                        bodyStyle={{ backgroundColor: 'white' }}
                        bordered={false}
                        style={{ width: '100%',  marginTop: '10px', marginBottom: '10px' , marginRight:'5px'}}>

                        <Form form={form} name="Dataset params" labelCol={{ span: 15 }}
                            wrapperCol={{ span: 24 }}
                            layout="inline"
                            onValuesChange={onFormLayoutChange}
                            style={{ width: '100%' }}>

                            <Form.Item
                                label="Data type"
                                name="dtype"
                                rules={[{ required: true, message: 'Please select a data type' }]}
                            >
                                <Select

                                    optionFilterProp="children"
                                    onChange={(value) => setdtype(value)}
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={[{ value: 'text', label: 'text' }, { value: 'img', label: 'images' }, {value:'One D', label:"One D"}]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Data Folder"
                                name="folder"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Test Folder"
                                name="testfolder"
                            >
                                <Input />
                            </Form.Item>

                        </Form>
                    </Card>
                </Col>
                <Col span={12}>
                    {dtype == 'img' &&
                        <Card
                            headStyle={{ fontWeight: 800, fontSize: 24 }}
                            bodyStyle={{ backgroundColor: 'white' }}
                            bordered={false}
                            style={{ width: '100%',  marginTop: '10px', marginBottom: '10px' , marginLeft:'5px'}}>
                            <Form form={form} name="Dataset params" labelCol={{ span: 15 }}
                                wrapperCol={{ span: 24 }}
                                layout="inline"
                                onValuesChange={onFormLayoutChange}
                                style={{ width: '100%' }}>

                                <Form.Item
                                    label="Normalize"
                                    name="normalize"
                                    rules={[{ required: true, message: 'Please select an optimizer' }]}
                                >
                                    <Select

                                        optionFilterProp="children"

                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Mean"
                                    name="mean"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Std Deviation"
                                    name="std"
                                >
                                    <Input />
                                </Form.Item>

                            </Form>
                        </Card>}

                </Col>
            </Row>

        </Card>

    )
}

export default DatasetCard;