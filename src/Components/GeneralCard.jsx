import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Button, Space, Checkbox } from 'antd';
import '../styles/Layout.css'

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const GeneralCard = (props) => {

    // const [formData, setFormData] = useState({task:'', method:'', host:'', scheme:''})
    const handleSchemeChange = (value) => {
        props.onSelectScheme(value);
    }
    
    const [form] = Form.useForm();
    let formData = {}
    const onFormLayoutChange = () => {

        let fieldVals = form.getFieldsValue()
        props.onChangeData({general : {...fieldVals}})
        // props.set
        // props.genData = {...fieldVals}
        // console.log('fields ' , fieldVals)
    }

    const onFinish = (val) => {
        console.log('on finish ' , val)
    }
    const plotOptions = ['Train/Test loss', 'Test Accuracy', 'Round times', 'Total Bytes'];
    
    return (

        <Card title="General Information"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}>

            <Form form = {form} labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onValuesChange={onFormLayoutChange}
                style={{ width: '90%' }}>

                <Form.Item
                    label="Task Name"
                    name="task"
                    rules={[{ required: true, message: 'Task name is required' }]}
                >
                    <Input placeholder="Task name is required" style={{width:'100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Task Overview"
                    name="taskOverview"
                    rules={[{ required: false }]}
                >
                    <TextArea rows={4} placeholder="Optionally provide overview description of the task going to achieve here" style={{width:'100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Training Scheme"
                    name="method"
                    rules={[{ required: true, message: 'Task name is required' }]}
                >
                    <Select
                        onChange={(value) => handleSchemeChange(value)}
                        options={[
                            { value: 'FedL', label: 'Federated Learning' },
                            { value: 'DistL', label: 'Distributed Learning' },

                        ]}
                    />
                    {/* 
                <Select
                    onChange={(e) => setScheme(schemeOptions[e])}
                    
                >
                    {schemeOptions.map((option, idx) => (
                        <option value={idx}>{option}</option>
                    ))}
                </Select> */}
                </Form.Item>

                <Form.Item
                    label="Enter the Host IP"
                    name="host"
                    rules={[{ required: true, message: 'Host IP is required' }]}
                >
                    <Input placeholder="Host IP is required" />
                </Form.Item>

                <Form.List name="clients">
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
                </Form.List>

                <Form.Item
                    label="Select Plots Required"
                    labelCol={{ span: 4 }}
                    wrapperCol={{span:8}}
                    name="plots"
                    style={{ display: 'inline', width: 'calc(80% - 8px)' }}
                >
                    <CheckboxGroup  options={plotOptions} />
                </Form.Item>
            </Form>
        </Card>



    )
}

export default GeneralCard;