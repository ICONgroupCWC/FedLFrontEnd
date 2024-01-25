import React, { useState } from "react";
import { BrowserRouter as Redirect, useNavigate } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Select, Card, Button, Space, Modal } from 'antd';
import GeneralCard from "./GeneralCard"
import ModelCard from "./ModelCard"
import ModelCardHetero from "./ModelCardHetero";
import '../styles/Layout.css'
import FederatedCard from "./FederatedCard";
import FederatedHeteroCard from "./FederatedHetroCard";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { addFedData } from "../redux/reducers/fedDataSlice";
import { addClientData } from "../redux/reducers/clientDataSlice"
import { startProcess } from "../redux/reducers/processingSlice";
import { startReceive } from "../redux/reducers/receivingSlice";
import { serialize } from 'bson';
import { Buffer } from 'buffer';
import ModelParameterCard from "./ModelParameterCard";
import ModelParameterCardHetero from "./ModelParameterCardHetero";
import DatasetCard from "./DatasetCard";
// import { resolve } from "path";



const { Content } = Layout;

const Task = () => {

    let schemeState = { scheme: '' }
    const [jobData, setJobData] = useState({})
    const [fedState, setFedLState] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleDashboard = () => {
        navigate("/dashboard");
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dispatch = useDispatch()

    let handleScheme = (schemeValue) => {
        schemeState.scheme = schemeValue;
        setFedLState(schemeState.scheme)
        // if (schemeState.scheme == 'FedL') {
        //     setFedLState(true)
        // }
        // else {
        //     setFedLState(false)
        // }
    }

    const handleChangeData = (data) => {
        let key = Object.keys(data)[0]

        setJobData(prev => ({ ...prev, [key]: data[key] }))
        console.log('data change ', jobData)
    }

    let handleOnsubmit = () => {
        console.log('submit data ', jobData)
        let hosturl;
        if (fedState == 'FedL') {
            hosturl = "ws://" + jobData.general.host + ":8200/job_receive"
        }
        else if (fedState == 'FedLH') {
            hosturl = "ws://" + jobData.general.host + ":8200/job_receive_hetero"
        }

        // axios.post(hostIp, jobData)
        // .then(response => console.log(response));]
        console.log('stringy job data ', JSON.stringify(jobData))


        let webSocket = new WebSocket(hosturl);

        const reader = new FileReader();
        const rep_reader = new FileReader();
        const ext_reader = new FileReader();
        let bsonData;
        webSocket.onopen = (event) => {

            if (fedState == 'FedL') {


                let rawData = new ArrayBuffer();

                reader.onload = (e) => {
                    rawData = e.target.result;
                    const bufferData = Buffer.from(rawData);
                    bsonData = serialize({  // whatever js Object you need
                        file: bufferData,
                        jobData: jobData
                    });

                    dispatch(addFedData(jobData))
                    dispatch(startProcess())
                    webSocket.send(bsonData);
                }


            }

            else if (fedState == 'FedLH') {


                let file_count = 2
                let rawData_rep = new ArrayBuffer();
                let rawData_ext = new ArrayBuffer();

                let rep_buffer_data;
                let ext_buffer_data;
                rep_reader.onload = (e) => {
                    rawData_rep = e.target.result;
                    rep_buffer_data = Buffer.from(rawData_rep);
                    // resolve()

                    bsonData = serialize({  // whatever js Object you need
                        rep_file: rep_buffer_data,
                        ext_file: ext_buffer_data,
                        jobData: jobData
                    });

                    if (--file_count == 0) {

                        console.log('dispatching')
                        dispatch(addFedData(jobData))
                        dispatch(startProcess())
                        console.log('sending websocket')
                        webSocket.send(bsonData);

                    }

                }

                ext_reader.onload = (e) => {
                    rawData_ext = e.target.result;
                    ext_buffer_data = Buffer.from(rawData_ext);

                    bsonData = serialize({  // whatever js Object you need
                        rep_file: rep_buffer_data,
                        ext_file: ext_buffer_data,
                        jobData: jobData
                    });
                    
                    if (--file_count == 0) {

                        console.log('dispatching')
                        dispatch(addFedData(jobData))
                        dispatch(startProcess())
                        console.log('sending websocket')
                        webSocket.send(bsonData);

                    }


                }






            }
            //     webSocket.onopen = (event) => {

            //         dispatch(addFedData(jobData))
            //         dispatch(startProcess())
            //         webSocket.send(bsonData);
            //       };
            //     // ws.send(bsonData);
            //   }
            if (fedState == 'FedL') {
                reader.readAsArrayBuffer(jobData.modelData.model[0].originFileObj);
            }
            else {
                rep_reader.readAsArrayBuffer(jobData.modelData.repModel[0].originFileObj)
                ext_reader.readAsArrayBuffer(jobData.modelData.extModel[0].originFileObj);
            }





        };


        webSocket.onmessage = (event) => {


            dispatch(addClientData(event.data));

            dispatch(startReceive());
        }

        // showModal();
    }

    return (

        <Content
            className="site-layout" style={{ padding: '0 50px', minHeight: '600px' }}>

            <GeneralCard onSelectScheme={handleScheme} onChangeData={handleChangeData}></GeneralCard>

            {fedState == 'FedL' && <FederatedCard onChangeData={handleChangeData}></FederatedCard>}
            {fedState == 'FedLH' && <FederatedHeteroCard onChangeData={handleChangeData}></FederatedHeteroCard>}
            {fedState == 'FedL' && <ModelCard onChangeData={handleChangeData}></ModelCard>}
            {fedState == 'FedLH' && <ModelCardHetero onChangeData={handleChangeData}></ModelCardHetero>}
            {fedState == 'FedL' && <ModelParameterCard onChangeData={handleChangeData} ></ModelParameterCard>}
            {fedState == 'FedLH' && <ModelParameterCardHetero onChangeData={handleChangeData} ></ModelParameterCardHetero>}
            <DatasetCard onChangeData={handleChangeData} ></DatasetCard>
            <div style={{ width: '100%', align: 'center' }}>
                <Button align='center' type="primary" htmlType="submit" block onClick={handleOnsubmit}>
                    Submit
                </Button>
            </div>

            <Modal title="Successfully submitted" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}


                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="link"
                        type="primary"
                        onClick={handleDashboard}
                    >
                        Dashboard
                    </Button>,
                ]}
            >
                <p>Go to Dashboard to see progress</p>

            </Modal>

        </Content>


    )
}

export default Task

