import React, { useState, useEffect } from "react";
import { Layout, Col, Row, Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from 'react-chartjs-2';
import '../styles/Layout.css'
import { Header } from "antd/es/layout/layout";
import { useSelector, useDispatch } from 'react-redux'
import { Progress } from 'antd';
import { stopReceive } from "../redux/reducers/receivingSlice";

const { Content } = Layout;
const Dashboard = () => {

  const clientData = useSelector(state => state.clientData)
  const fedData = useSelector(state => state.fedData)
  const processing = useSelector(state => state.processing)
  const receiving = useSelector(state => state.receiving)
  const [totalComRounds, settotalComRounds] = useState(0)
  const [epochsNo, setepochsNo] = useState(0)
  const [clientFraction, setclientFractions] = useState(0.0)
  const [lr, setlr] = useState(0.0)
  const [minibatch, setminibatch] = useState(0)
  const [minibatchtest, setminibatchtest] = useState(0)
  const [noOfClients, setnoOfClients] = useState(0)
  const [totalClients, settotalClients] = useState(0)
  const [initiated, setInitiated] = useState(false)
  const [epochDone, setepochDone] = useState(false)
  const [currentEpoch, setcurrentEpoch] = useState([])
  const [clientIps] = useState([])
  const [trainingList, setTrainingList] = useState()
  const dispatch = useDispatch()
  const [accuracy, setAccuracy] = useState([])
  const [trainingLoss, settrainingLoss] = useState([])
  const [testLoss, settestLoss] = useState([])
  const [roundTimes, setroundTimes] = useState([])
  const [results, setResults] = useState(false)
  const [renderChart, setRenderChart] = useState(false)
  const [lostdata, setlossdata] = useState(null)
  const [chartLabels] = useState([])
  const [datacount, setdatacount] = useState(0)

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    if (epochDone) {
      // console.log('epoch done stoping receive')
      dispatch(stopReceive());
    }
    // console.log('epoch falsing')
    setepochDone(false)

    if (results) {

      setlossdata()

      setRenderChart(true)
    }
  });

  if (processing.processing && !initiated) {
    fedData.map(item => {
      settotalComRounds(item.scheme.comRounds)
      setepochsNo(item.scheme.epoch)
      setclientFractions(item.scheme.clientFraction)
      setminibatch(item.scheme.minibatch)
      setminibatchtest(item.scheme.minibatchtest)
      setlr(item.scheme.lr)
      settotalClients(item.general.clients.length)

      const activeClients = Math.max(Math.floor(clientFraction * totalClients), 1);

      setnoOfClients(activeClients)

    })


    setInitiated(true)
  }

  if (receiving.receiving && !epochDone) {
    var clientJson = JSON.parse(clientData);
    setepochDone(true)
    console.log(clientJson)
    console.log(clientJson.status === "training")


    if (clientJson.status === "training") {

      console.log('setting current epoch')
      var index = currentEpoch.findIndex(client => Object.keys(client)[0] === clientJson.client);
      if (index === -1) {
        currentEpoch.push({
          [clientJson.client]: clientJson.epoch
        });
      } else {
        currentEpoch[index] = {
          [clientJson.client]: clientJson.epoch
        };
      }

      if (!clientIps.includes(clientJson.client)) {
        clientIps.push(clientJson.client);
      }

    }
    else {
      console.log('setting results')
      setAccuracy(clientJson.accuracy.replace("[", "").replace("]", "").split(","))

      settrainingLoss(clientJson.train_loss.replace("[", "").replace("]", "").split(","))
      settestLoss(clientJson.test_loss.replace("[", "").replace("]", "").split(","))
      setroundTimes(clientJson.round_time.replace("[", "").replace("]", "").split(","))
      setdatacount(datacount + 1)
      if (!chartLabels.includes(clientJson.round)) {
        chartLabels.push(clientJson.round)
      }

      setResults(true)
    }
    console.log('loss results')
    console.log(trainingLoss)
    console.log(testLoss)
    console.log('labels ')
    console.log(chartLabels)

  }

  let lossoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Training/Test Loss',
      },
    },
  };

  let accoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Accuracy',
      },
    },
  };

  let timeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Com Round Times',
      },
    },
  };

  let lossdata = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Training loss',
        data: trainingLoss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Test Loss',
        data: testLoss,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  let accdata = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Test accuracy',
        data: accuracy,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  }

  let timedata = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Communication round times(s)',
        data: roundTimes,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  }


  return (


    <Content
      className="site-layout" style={{ padding: '0 50px', minHeight: '600px' }}
    >

      <div style={{ width: '100%', align: 'left' }}>
        <h1 >Dashboard</h1>
      </div>
      <Row>
        <Col span={8} style={{ align: 'center' }}> <Card style={{ width: "100%", height: 300 }}>
          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Com Rounds</Col>
            <Col span={12}>{processing.processing && totalComRounds}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Local epochs number</Col>
            <Col span={12}>{processing.processing && epochsNo}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Local Minibatch size</Col>
            <Col span={12}>{processing.processing && minibatch}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Test Minibatch size</Col>
            <Col span={12}>{processing.processing && minibatchtest}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Learning rate</Col>
            <Col span={12}>{processing.processing && lr}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Number of clients</Col>
            <Col span={12}>{processing.processing && totalComRounds}</Col>
          </Row>

          <Row>
            <Col span={12} style={{ textAlign: 'left' }}>Client Fraction</Col>
            <Col span={12}>{processing.processing && clientFraction}</Col>
          </Row>

        </Card></Col>

        <Col span={8} style={{ align: 'center' }}>
          <Row>
            <Card style={{ width: "100%", height: 300 }}>
              {currentEpoch.map(client => (
                <Row>
                  <Col span={8} style={{ textAlign: 'left' }}> {Object.keys(client)[0]} </Col>
                  <Col span={16} style={{ textAlign: 'center' }}> <Progress percent={Math.round((client[Object.keys(client)[0]] / epochsNo) * 100, 0)} /> </Col>
                </Row>
                // <Progress percent={( currentEpoch[client]/ epochsNo) * 100} />
              ))}
              {/* {trainingList} */}

            </Card>
          </Row>
        </Col>
        <Col span={8} style={{ align: 'center' }}>
          <Row>
            <Card style={{ width: "100%", height: 300 }}>
              {renderChart && <Line options={timeOptions} data={timedata} />}
            </Card>
          </Row>
        </Col>
      </Row>
      {renderChart && <Row>
        <Col span={12}>
          <Card style={{ width: "100%", height: 500 }}>
            <Line options={lossoptions} data={lossdata} />
          </Card>
        </Col>
        <Col span={12}>

          <Card style={{ width: "100%", height: 500 }}>
            <Line options={accoptions} data={accdata} />

          </Card>
        </Col>

      </Row>}

    </Content>
  )
}

export default Dashboard