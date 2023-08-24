import React, { useState, useEffect } from "react";
import { Layout, Col, Row, Card, Collapse, Descriptions, List, Table, Button } from 'antd';
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
import { Buffer } from "buffer";
import unpickle from 'unpickle'
import jpickle from "jpickle"
import { dashboard_columns } from "../constants/table_data";
const { Content } = Layout;
const { Panel } = Collapse;

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
  const [totalBytes, settotalBytes] = useState([])
  const [roundTimes, setroundTimes] = useState([])
  const [currRound, setcurrRound] = useState(0)
  const [results, setResults] = useState(false)
  const [renderChart, setRenderChart] = useState(false)
  const [lostdata, setlossdata] = useState(null)
  const [modelData, setmodelData] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [chartLabels] = useState([])
  const [datacount, setdatacount] = useState(0)
  const [plots, setPlots] = useState(null)
  const [taskName, settaskName] = useState("")
  const [taskOverview, settaskOverview] = useState("")
  const [taskScheme, settaskScheme] = useState("")
  const [modelOverview, setmodelOverview] = useState("")
  const [lossFunction, setlossFunction] = useState("")
  const [optimizer, setoptimizer] = useState("")

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

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
  }

  const downloadModel = () => {

    const data = {
      user_name: "test",
      task_name: taskName,
    };
    fetch('http://localhost:5000/receive_weights', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `model.pt`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }

  if (processing.processing && !initiated) {
    fedData.map(item => {
      settotalComRounds(item.scheme.comRounds)
      setepochsNo(item.scheme.epoch)
      setclientFractions(item.scheme.clientFraction)
      setminibatch(item.scheme.minibatch)
      setminibatchtest(item.scheme.minibatchtest)
      setlr(item.scheme.lr)
      settotalClients(item.general.clients.length)
      settaskName(item.general.task)
      settaskOverview(item.general.taskOverview)
      settaskScheme(item.general.method)
      setmodelOverview(item.modelData.modelOverview)
      setlossFunction(item.modelParam.loss)
      setoptimizer(item.modelParam.optimizer)
      const activeClients = Math.max(Math.floor(item.scheme.clientFraction * item.general.clients.length), 1);
      console.log('clients  ', activeClients)
      setnoOfClients(activeClients)

      if (("plots" in item.general) && (item.general.plots !== undefined)) {
        setPlots(item.general.plots)
      }

      let table_data = [{
        key: '1',
        rounds: item.scheme.comRounds,
        epoch: item.scheme.epoch,
        minibatch: item.scheme.minibatch,
        tminibatch: item.scheme.minibatchtest,
        learningRate: item.scheme.lr,
        clients: activeClients,
        fraction: item.scheme.clientFraction
      }]
      console.log('table data ', table_data)

      setTableData(table_data)
      console.log('table data is set')

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
      settotalBytes(clientJson.total_bytes.replace("[", "").replace("]", "").split(","))
      setcurrRound(clientJson.round)
      setdatacount(datacount + 1)
      if (!chartLabels.includes(clientJson.round)) {
        chartLabels.push(clientJson.round)
      }

      setResults(true)

      // if (clientJson.round === totalComRounds) {
      //   console.log('downloading')
      //   console.log(clientJson.model)
      //   setmodelData(clientJson.model)
      // }
    }
    console.log('loss results')
    console.log(trainingLoss)
    console.log(testLoss)
    console.log('labels ')
    console.log(chartLabels)
    console.log('table  ', tableData)

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

  let byteOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bytes vs Accuracy',
      },
    },
  };

  const plot_options = { "Train/Test loss": lossoptions, "Test Accuracy": accoptions, "Round times": timeOptions, "Total Bytes": byteOptions }

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

  let byteData = {
    labels: totalBytes,
    datasets: [
      {
        label: 'test accuracy',
        data: accuracy,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ],
  }

  const plot_data = { "Train/Test loss": lossdata, "Test Accuracy": accdata, "Round times": timedata, "Total Bytes": byteData }

  const schemes = {
    FedL: 'Federated Learning',
    DistL: 'Distributed Learning'
  };

  const optimOptions = {
    Adadelta: 'Adadelta', Adagrad: 'Adagrad', Adam: 'Adam', AdamW: 'AdamW', SparseAdam: 'SparseAdam', Adamax: 'Adamax',
    ASGD: 'ASGD', LBFGS: 'LBFGS', NAdam: 'NAdam', RAdam: 'RAdam', RMSprop: 'RMSprop', Rprop: 'Rprop', SGD: 'SGD'
  };

  const lossOptions = {
    L1Loss: 'L1Loss',
    MSELoss: 'MSELoss',
    CrossEntropyLoss: 'CrossEntropyLoss',
    BCELoss: 'BCELoss',
    BCEWithLogitsLoss: 'BCEWithLogitsLoss'
  };


  return (


    <Content
      className="site-layout" style={{ padding: '0 50px', minHeight: '600px' }}
    >

      <div style={{ width: '100%', align: 'left' }}>
        <h1 >Dashboard</h1>
      </div>

      <Collapse bordered={false} defaultActiveKey={['1']} >

        <Panel header="Training Visualization" key="1">
          <Row>
            <Col span={18} style={{ align: 'center' }}>
              <Card style={{ width: "100%", height: 300 }}>
                {initiated &&
                  <Table
                    pagination={false}
                    bordered
                    dataSource={tableData} columns={dashboard_columns} />}

                {/* <Row>
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
                  <Col span={12} style={{ textAlign: 'left' }}>Active Clients</Col>
                  <Col span={12}>{processing.processing && noOfClients}</Col>
                </Row>

                <Row>
                  <Col span={12} style={{ textAlign: 'left' }}>Total Clients</Col>
                  <Col span={12}>{processing.processing && totalClients}</Col>
                </Row>

                <Row>
                  <Col span={12} style={{ textAlign: 'left' }}>Client Fraction</Col>
                  <Col span={12}>{processing.processing && clientFraction}</Col>
                </Row> */}

              </Card>
            </Col>

            <Col span={6} style={{ align: 'center' }}>
              <Row align="middle">
                <Card style={{ width: "100%", height: 300 }}>


                  <Progress type="circle" percent={(currRound / totalComRounds) * 100} format={() => `${(currRound / totalComRounds) * 100} %`} style={{ marginTop: 50 }} />
                  {/* <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} /> */}

                  {/* {currentEpoch.map(client => (
                <Row>
                  <Col span={8} style={{ textAlign: 'left' }}> {Object.keys(client)[0]} </Col>
                  <Col span={16} style={{ textAlign: 'center' }}> <Progress percent={Math.round((client[Object.keys(client)[0]] / epochsNo) * 100, 0)} /> </Col>
                </Row>
                // <Progress percent={( currentEpoch[client]/ epochsNo) * 100} />
              ))} */}
                  {/* {trainingList} */}

                </Card>
              </Row>
            </Col>
            {/* <Col span={7} style={{ align: 'center' }}>

              <Card style={{ width: "100%", height: 300 }}>
                {renderChart && <Line options={timeOptions} data={timedata} />}
              </Card>

            </Col>
            <Col span={7} style={{ align: 'center' }}>

              <Card style={{ width: "100%", height: 300 }}>
                {renderChart && <Line options={byteOptions} data={byteData} />}
              </Card>

            </Col> */}
          </Row>
          {renderChart && plots !== undefined && plots.length < 3 &&
            <Row>
              {plots.map((plot) =>

                <Col span={12}>
                  <Card >
                    <Line options={plot_options[plot]} data={plot_data[plot]} />
                  </Card>
                </Col>


              )}
            </Row>

          }

          {renderChart && plots !== undefined && plots.length > 2 &&


            <Row>
              {plots.slice(0, 2).map((plot) =>

                <Col span={12}>
                  <Card >
                    <Line options={plot_options[plot]} data={plot_data[plot]} />
                  </Card>
                </Col>


              )}
            </Row>}

          {renderChart && plots !== undefined && plots.length > 2 &&


            <Row>
              {plots.slice(2, 4).map((plot) =>

                <Col span={12}>
                  <Card >
                    <Line options={plot_options[plot]} data={plot_data[plot]} />
                  </Card>
                </Col>


              )}
            </Row>}
          {/* {renderChart &&
            <Row>
              {(plots !== undefined && plots.includes("Round times")) && <Col span={plots.includes("Total Bytes") ? 12 : 12}>
                <Card >
                  <Line options={timeOptions} data={timedata} />
                </Card>
              </Col>}
              {
                (plots !== undefined && plots.includes("Total Bytes")) &&
                <Col span={plots.includes("Round times") ? 12 : 24}>

                  <Card >
                    <Line options={byteOptions} data={byteData} />

                  </Card>
                </Col>

              }
            </Row>

          } */}
        </Panel>
      </Collapse>

      <Collapse bordered={false} defaultActiveKey={['1']} >


        <Panel header="Training Overview">
          <Row>
            <Col span={12}>

              <Card>
                <List
                  itemLayout="horizontal"
                  align="left"
                  size="small">
                  <List.Item>
                    <List.Item.Meta

                      title="Task name"
                      description={taskName}
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta

                      title="Task Overview"
                      description={taskOverview}
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta

                      title="Model Overview"
                      description={modelOverview}
                    />
                  </List.Item>

                </List>
              </Card>

            </Col>

            <Col span={12}>

              <Card>
                <List
                  itemLayout="horizontal"
                  align="left"
                  size="small">
                  <List.Item>
                    <List.Item.Meta

                      title="Training Scheme"
                      description={schemes[taskScheme]}
                    />
                  </List.Item>

                  <List.Item>
                    <List.Item.Meta

                      title="Loss function"
                      description={lossOptions[lossFunction]}
                    />
                  </List.Item>

                  <List.Item>
                    <List.Item.Meta

                      title="Optimizer"
                      description={optimOptions[optimizer]}
                    />
                  </List.Item>
                </List>
              </Card>

            </Col>

            <Button onClick={downloadModel}>Download</Button>
          </Row>




        </Panel>
      </Collapse>

    </Content>
  )
}

export default Dashboard