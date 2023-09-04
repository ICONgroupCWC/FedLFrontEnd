import React, { useState, useEffect } from "react";
import { Layout, Col, Row, Card, Collapse, Descriptions, List, Table, Button, Space } from 'antd';
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
  const [clientFraction, setclientFractions] = useState(1)
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

      if (item.scheme.scheduler == 'full') {

        setclientFractions(1)
      }
      const activeClients = Math.max(Math.floor(item.scheme.clientFraction * item.general.clients.length), 1);

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

    }
    // console.log('loss results')
    // console.log(trainingLoss)
    // console.log(testLoss)
    // console.log('labels ')
    // console.log(chartLabels)
    // console.log('plots  ', plots)

  }

  const plot_data = { "testAccuracy": accuracy, "trainLoss": trainingLoss, "commRounds": chartLabels, "transferedBytes": totalBytes, "testLoss": testLoss , 'totTimes': roundTimes}
  const plot_labels = {
    "testAccuracy": 'Test accuracy', "trainLoss": 'Training loss', "commRounds": 'Communication round',
    "transferedBytes": 'Total size (MB)', "testLoss": 'Test Loss', 'totTimes': 'Communication round time(s)'
  }

  const getPlotInformation = (x_axis, y_axis) => {

    let plot_name = plot_labels[x_axis] + ' vs ' + plot_labels[y_axis];
    let plotOptions = {

      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: plot_name,
        },
      },
    }

    let plotData = {
      labels: plot_data[x_axis],
      datasets: [
        {
          label: plot_labels[y_axis],
          data: plot_data[y_axis],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ],
    }

    // console.log('plot information') 
    // console.log(plotOptions)
    // console.log(plotData)
    return { 'options': plotOptions, 'data': plotData }
  }

  // const plot_data = { "Train/Test loss": lossdata, "Test Accuracy": accdata, "Round times": timedata, "Total Bytes": byteData }

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

              </Card>
            </Col>

            <Col span={6} style={{ align: 'center' }}>
              <Row align="middle">
                <Card style={{ width: "100%", height: 300 }}>


                  <Progress type="circle" percent={(currRound / totalComRounds) * 100} format={() => `${(currRound / totalComRounds) * 100} %`} style={{ marginTop: 50 }} />
                </Card>
              </Row>
            </Col>
          </Row>

          {renderChart && plots !== undefined &&

            <Space direction="horizontal" wrap style={{ display: 'flex', margin: '50px 50px' }}>

              {

                plots.map(plot => {

                  let LineData = getPlotInformation(plot.x_axis, plot.y_axis);
                  console.log('line data ');
                  console.log(LineData);
                  return (
                    <Card
                      style={{ height: '400px', width: '700px' }}
                    >
                      <Line options={LineData['options']} data={LineData['data']} />

                    </Card>
                  )
                }
                )
              }

            </Space>

          }

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