import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Select, Card, Button, Space } from 'antd';
import GeneralCard from "./GeneralCard"
import ModelCard from "./ModelCard"
import '../styles/Layout.css'
import FederatedCard from "./FederatedCard";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { addFedData } from "../redux/reducers/fedDataSlice";
import { addClientData } from "../redux/reducers/clientDataSlice"
import { startProcess } from "../redux/reducers/processingSlice";
import { startReceive } from "../redux/reducers/receivingSlice";
import { serialize } from 'bson';
import { Buffer } from 'buffer';
import ModelParameterCard from "./ModelParameterCard";
import DatasetCard from "./DatasetCard";


const { Content } = Layout;

const Task = () => {

    let schemeState = { scheme: '' }
    const [jobData, setJobData] = useState({})
    const [fedVisible, setFedLState] = useState(false);

    // const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    let handleScheme = (schemeValue) => {
        schemeState.scheme = schemeValue;
        if (schemeState.scheme == 'FedL') {
            setFedLState(true)
        }
        else {
            setFedLState(false)
        }
    }

    const handleChangeData = (data) => {
        let key = Object.keys(data)[0]

        setJobData(prev => ({ ...prev, [key]: data[key] }))
        console.log('data change ', jobData)
    }

    let handleOnsubmit = () => {
        console.log('submit data ', jobData)
        const hosturl = "ws://" + jobData.general.host + ":8200/job_receive"
        // axios.post(hostIp, jobData)
        // .then(response => console.log(response));]
        console.log('stringy job data ', JSON.stringify(jobData))


        let webSocket = new WebSocket(hosturl);



        webSocket.onopen = (event) => {

            const reader = new FileReader();
            let rawData = new ArrayBuffer();
            let bsonData;
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
                //     webSocket.onopen = (event) => {

                //         dispatch(addFedData(jobData))
                //         dispatch(startProcess())
                //         webSocket.send(bsonData);
                //       };
                //     // ws.send(bsonData);
                //   }
                reader.readAsArrayBuffer(jobData.modelData.model[0].originFileObj);

               
            };
        

        webSocket.onmessage = (event) => {


            dispatch(addClientData(event.data));

            dispatch(startReceive());
        }
    }

    return (

        <Content
            className="site-layout" style={{ padding: '0 50px', minHeight: '600px' }}>

            <GeneralCard onSelectScheme={handleScheme} onChangeData={handleChangeData}></GeneralCard>
            
            {fedVisible && <FederatedCard onChangeData={handleChangeData}></FederatedCard>}
            <ModelCard onChangeData={handleChangeData}></ModelCard>
            <ModelParameterCard onChangeData={handleChangeData} ></ModelParameterCard>
            <DatasetCard onChangeData={handleChangeData} ></DatasetCard>
            <div style={{ width: '100%', align: 'center' }}>
                <Button align='center' type="primary" htmlType="submit" block onClick={handleOnsubmit}>
                    Submit
                </Button>
            </div>

        </Content>


    )
}

export default Task

