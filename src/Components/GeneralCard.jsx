import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Button, Space, Checkbox, Row } from 'antd';
import '../styles/Layout.css'

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const GeneralCard = (props) => {

    
    const [form] = Form.useForm();
    const [algo, setalgo] = useState('')
    const [scheme, setScheme] = useState('')
    let formData = {}

    const handleSchemeChange = (value) => {
        props.onSelectScheme(value);
        setScheme(value)
    }

    const handleAlgoChange = (value) => {
        setalgo(value)
    }
    const onFormLayoutChange = () => {

        let fieldVals = form.getFieldsValue()
        props.onChangeData({ general: { ...fieldVals } })
       
    }

    return (

        <Card title="General Information"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}>

            <Form form={form} labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onValuesChange={onFormLayoutChange}
                style={{ width: '90%' }}>

                <Form.Item
                    label="Task Name"
                    name="task"
                    rules={[{ required: true, message: 'Task name is required' }]}
                >
                    <Input placeholder="Task name is required" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Task Overview"
                    name="taskOverview"
                    rules={[{ required: false }]}
                >
                    <TextArea rows={4} placeholder="Optionally provide overview description of the task going to achieve here" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Training Scheme"
                    name="method"
                    rules={[{ required: true, message: 'Task name is required' }]}
                >
                    <Select
                        onChange={(value) => handleSchemeChange(value)}
                        options={[
                            { value: 'FedL', label: 'Federated Learning - Fed AVG' },
                            { value: 'FedLH', label: 'Federated Learning Heterogenious' },

                        ]}
                    />
                    
                </Form.Item>

                <Form.Item
                    label="Algorithm type"
                    name="algo"
                    rules={[{ required: true, message: 'Type is required' }]}
                >
                    <Select
                        onChange={(value) => handleAlgoChange(value)}
                        options={[
                            { value: 'Classification', label: 'Classification' },
                            { value: 'Regression', label: 'Linear Regression' },

                        ]}
                    />
                    
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

                <Row>Select Plots Required</Row>
                <Form.List name="plots"
                    label="Select Plots Required">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Space
                                    key={field.key}
                                    style={{ display: "flex", marginBottom: 8, marginLeft: 8 }}
                                    align="baseline"
                                >
                                    <div>X axis</div>
                                    <Form.Item
                                        {...field}
                                        key={'x'+field.key}
                                        name={[field.name, "x_axis"]}
                                    >
                                        <Select
                                            style={{ display: 'inline-block', width: 300 }}
                                            options={[
                                                { value: 'testAccuracy', label: 'Test Accuracy'  , disabled: (algo=='Regression') },
                                                { value: 'trainLoss', label: 'Train Loss' },
                                                { value: 'commRounds', label: 'Communication Rounds' },
                                                { value: 'totTimes', label: 'Communication Round Times' },
                                                { value: 'transferedBytes', label: 'Bytes Transferred' , disabled: (scheme == 'FedLH')},
                                                { value: 'testLoss', label: 'Test Loss', disabled: (scheme == 'FedLH') }

                                            ]}
                                        />
                                    </Form.Item>
                                    <div>Y axis</div>
                                    <Form.Item
                                        {...field}
                                        key={'y'+field.key}
                                        name={[field.name, "y_axis"]}
                                    >
                                        <Select
                                            style={{ display: 'inline-block', width: 300 }}
                                            options={[
                                                { value: 'testAccuracy', label: 'Test Accuracy' , disabled: (algo=='Regression')},
                                                { value: 'trainLoss', label: 'Train Loss' },
                                                { value: 'commRounds', label: 'Communication Rounds' },
                                                { value: 'totTimes', label: 'Communication Round Times' },
                                                { value: 'transferedBytes', label: 'Bytes Transferred' , disabled: (scheme == 'FedLH')},
                                                { value: 'testLoss', label: 'Test Loss', disabled: (scheme == 'FedLH')  }

                                            ]}
                                        />
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
                                    Add Plot
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

            </Form>
        </Card>



    )
}

export default GeneralCard;