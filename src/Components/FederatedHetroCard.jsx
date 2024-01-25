import React, { useState } from "react";
import { Form, Input, Select, Card } from 'antd';
import '../styles/Layout.css'


const FederatedHeteroCard = (props) => {

    const [form] = Form.useForm();
    const [scheduler, setscheduler] = useState('')
    const onFormLayoutChange = () => {

        let fieldVals = form.getFieldsValue()
        props.onChangeData({ scheme: { ...fieldVals } })
        // props.set
        // props.genData = {...fieldVals}
        // console.log('fields ' , fieldVals)
    }

    return (

        <Card title="Federated Learning Heterogeneous"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)", marginTop: '10px', marginBottom: '10px' }}>

            <Form form={form} name="Federated params" labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onValuesChange={onFormLayoutChange}
                style={{ width: '90%' }}>
                <Form.Item
                    label="batch size"
                    name="batch_size"
                    rules={[{ required: true, message: 'Please enter a valid number for batch size' }]}
                >
                    <Input placeholder="batch size eg:10" />
                </Form.Item>

                <Form.Item
                    label="Number of Comm Rounds"
                    name="comRounds"
                    rules={[{ required: true, message: 'Please enter a valid number for Communication rounds' }]}
                >
                    <Input placeholder="number of epoch eg:10" />
                </Form.Item>

                <Form.Item
                    label="Learning rate representation learner"
                    name="rep_lr"
                    rules={[{ required: true, message: 'Please enter a valid number for learning rate' }]}
                >
                    <Input placeholder="learning rate eg:0.001" />
                </Form.Item>

                <Form.Item
                    label="Learning rate Predictor"
                    name="pred_lr"
                    rules={[{ required: true, message: 'Please enter a valid number for learning rate' }]}
                >
                    <Input placeholder="learning rate eg:0.001" />
                </Form.Item>

                {/* <Form.Item
                    label="Scheduler Type"
                    name="scheduler"
                    rules={[{ required: true }]}
                >
                    <Select
                        onChange={(value) => setscheduler(value)}
                        options={[
                            { value: 'full', label: 'Full' },
                            { value: 'random', label: 'Random' },
                            { value: 'round_robin', label: 'Round Robin' },
                            { value: 'latency', label: 'Latency Proportional' },

                        ]}
                    />
                </Form.Item> */}

                {/* {  scheduler == 'latency' &&
                    <Form.Item
                        label="No of Rounds for Latency Average "
                        name="latency_avg"
                        rules={[{ required: true, message: 'Please enter a number of rounds needed for latency averaging' }]}
                    >
                        <Input placeholder="client fraction eg:1" />
                    </Form.Item>
                } */}

                {/* <Form.Item
                    label="Client fraction"
                    name="clientFraction"
                    rules={[{ required: true, message: 'Please enter a valid amount for client fraction' }]}
                >
                    <Input  disabled={scheduler=='full'}  placeholder="client fraction eg:0.1" />
                </Form.Item> */}

                {/* <Form.Item
                    label="Local mini batch size for Test"
                    name="minibatchtest"
                    rules={[{ required: true, message: 'Please enter a valid number for local minibatch size for test' }]}
                >
                    <Input placeholder="test minibatch size eg:32" />
                </Form.Item> */}

                {/* <Form.Item
                    label="Number of communication rounds"
                    name="comRounds"
                    rules={[{ required: true, message: 'Please enter a valid number for number of communication rounds' }]}
                >
                    <Input placeholder="communication round number eg:10" />
                </Form.Item> */}

            </Form>
        </Card>

    )
}

export default FederatedHeteroCard;