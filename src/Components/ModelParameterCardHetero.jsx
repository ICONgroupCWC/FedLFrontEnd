import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { Form, Input, Select, Card, Button, Row, Col } from 'antd';
import '../styles/Layout.css'


const ModelParameterCardHetero = (props) => {

    const [form] = Form.useForm();
    const [compression, setCompression] = useState({})

    useEffect(() => {

        if (compression == 'quantize') {
            form.setFieldsValue({
                z_point: '',
                scale: '',
                num_bits: '2'
            });
        }
        else if(compression == 'topk' || compression == 'random' ) {
            form.setFieldsValue({
                r: ''
            });

        }
    }, [form, compression]);


    const onFormLayoutChange = () => {

        let fieldVals = form.getFieldsValue()
        props.onChangeData({ modelParam: { ...fieldVals } })
        // props.set
        // props.genData = {...fieldVals}
        // console.log('fields ' , fieldVals)
    }
    const optimOptions = [{ value: 'Adadelta', label: 'Adadelta' }, { value: 'Adagrad', label: 'Adagrad' }, { value: 'Adam', label: 'Adam' }, { value: 'AdamW', label: 'AdamW' },
    { value: 'SparseAdam', label: 'SparseAdam' }, { value: 'Adamax', label: 'Adamax' }, { value: 'ASGD', label: 'ASGD' }, { value: 'LBFGS', label: 'LBFGS' },
    { value: 'NAdam', label: 'NAdam' }, { value: 'RAdam', label: 'RAdam' }, { value: 'RMSprop', label: 'RMSprop' }, { value: 'Rprop', label: 'Rprop' },
    { value: 'SGD', label: 'SGD' },]

    const lossOptions = [{ value: 'L1Loss', label: 'L1Loss' }, { value: 'MSELoss', label: 'MSELoss' }, { value: 'CrossEntropyLoss', label: 'CrossEntropyLoss' },
    { value: 'BCELoss', label: 'BCELoss' }, { value: 'BCEWithLogitsLoss', label: 'BCEWithLogitsLoss' },]

    return (

        <Card title="Model Parameters"
            headStyle={{ fontWeight: 800, fontSize: 24 }}
            bodyStyle={{ backgroundColor: 'white' }}
            bordered={true}
            style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)", marginTop: '10px', marginBottom: '10px' }}>

            <Form form={form} name="Model params" labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                layout="vertical"
                onValuesChange={onFormLayoutChange}
                style={{ width: '90%' }}>

                <Form.Item
                    label="Optimizer-Representation Learner"
                    name="repOptimizer"
                    rules={[{ required: true, message: 'Please select an optimizer' }]}
                >
                    <Select
                        showSearch
                        style={{ alignItems: 'left' }}
                        placeholder="Search to Select"
                        optionFilterProp="children"

                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={optimOptions}
                    />
                </Form.Item>

                <Form.Item
                    label="Optimizer-Extractor"
                    name="extOptimizer"
                    rules={[{ required: true, message: 'Please select an optimizer' }]}
                >
                    <Select
                        showSearch
                        style={{ alignItems: 'left' }}
                        placeholder="Search to Select"
                        optionFilterProp="children"

                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={optimOptions}
                    />
                </Form.Item>

                <Form.Item
                    label="Loss"
                    name="loss"
                    rules={[{ required: true, message: 'Please select an Loss' }]}
                >
                    <Select
                        showSearch
                        style={{ alignItems: 'left' }}
                        placeholder="Search to Select"
                        optionFilterProp="children"

                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={lossOptions}
                    />
                </Form.Item>

            </Form>
        </Card>

    )
}

export default ModelParameterCardHetero;