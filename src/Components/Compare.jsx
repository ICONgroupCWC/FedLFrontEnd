import React, { useState, useEffect } from "react";
import { Layout, Col, Row, Card, Collapse, Descriptions, Button, Table, Space, Input, Select } from 'antd';
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
import { fetchData } from "../utils/http-client";
import { scheme_columns } from "../constants/table_data";
import { TaskTable } from "./TaskTable";
const { Content } = Layout;
const { Panel } = Collapse;
const { Search } = Input;
const Compare = () => {

  const [taskList, settaskList] = useState([])
  const [selected, setSelected] = useState(false)
  const [mapped, setMapped] = useState(false)
  const [tasks, settasks] = useState([])
  const [taskData, settaskData] = useState([])
  const [schemeData, setschemeData] = useState([])
  const [search, setSearch] = useState()
  const [trainLoss, settrainLoss] = useState({})
  const [testLoss, settestLoss] = useState({})
  const [roundTime, setroundTime] = useState({})
  const [accuracy, setaccuracy] = useState({})


  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
  }

  let lossoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Training Loss',
      },
    },
  };

  let testlossoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Test Loss',
      },
    },
  };

  let roundTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comm Round Times',
      },
    },
  };

  let accuracyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Test Accuracy',
      },
    },
  };

  // let lossdata = {

  //   datasets: 
  // }

  const dynamicColor = () => {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  let maxN = 0
  const map_tasks = () => {

    let task_all = []
    let scheme_all = []
    let train_loss_all = []
    let test_loss_all = []
    let round_time_all = []
    let test_accuracy_all = []
    
    tasks.forEach(function (item, index) {
      let task_item = item.task
      let scheme_item = item.federated
      let train_loss_item = item.train_loss
      let test_loss_item = item.test_loss
      let round_time_item = item.round_time
      let accuracy_item = item.test_accuracy
      let task = {
        key: index,
        name: task_item.name,
        scheme: task_item.scheme,
        date: task_item.date,
        commRounds: task_item.comm_rounds,
        clients: task_item.clients,
        fraction: task_item.client_fraction
      }

      let scheme = {
        key: index,
        name: task_item.name,
        optimizer: scheme_item.optimizer,
        loss: scheme_item.loss,
        minibatch: scheme_item.minibatch_size,
        testMinibacth: scheme_item.test_batch_size,
        learningRate: scheme_item.learning_rate,
        epoch: scheme_item.local_epoch,
        compress: scheme_item.compress
      }

      let train_loss = {
        label: task_item.name,
        data: train_loss_item,
        borderColor: dynamicColor(),
        backgroundColor: dynamicColor(),
      }

      let test_loss = {
        label: task_item.name,
        data: test_loss_item,
        borderColor: dynamicColor(),
        backgroundColor: dynamicColor(),
      }

      let round_times = {
        label: task_item.name,
        data: round_time_item,
        borderColor: dynamicColor(),
        backgroundColor: dynamicColor(),
      }

      let accuracy = {
        label: task_item.name,
        data: accuracy_item,
        borderColor: dynamicColor(),
        backgroundColor: dynamicColor(),
      }

      if (train_loss_item.length > maxN) {
        maxN = train_loss_item.length
        console.log('maxN ', maxN)
      }
      task_all.push(task)
      scheme_all.push(scheme)
      train_loss_all.push(train_loss)
      test_loss_all.push(test_loss)
      round_time_all.push(round_times)
      test_accuracy_all.push(accuracy)
    });

    // {datasets:train_loss_all}

    settaskData(task_all);
    setschemeData(scheme_all)
    settrainLoss({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: train_loss_all
    })

    settestLoss({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: test_loss_all
    })

    setroundTime({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: round_time_all
    })

    setaccuracy({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: test_accuracy_all
    })


    setMapped(true)
  }

  const data = {
    user_name: "test",
    task_name: 'test1',
  };

  useEffect(() => {
    fetchData(data, 'receive_tasks').then((data) => settaskList(data));
    console.log('tasks ', tasks)
  }, []);

  useEffect(() => {

    if (selected) {
      map_tasks()
    }
    console.log('train loss', trainLoss)
  }, [tasks]);


  const handleChange = (newValue) => {
    setSearch(newValue)
  };

  const taskClick = (task_name) => {

    console.log(task_name)
    const task_data = {
      user_name: "test",
      task_name: task_name
    }

    fetchData(task_data, 'receive_data').then((data) => {
      console.log('data ', data)
      settasks((prev_tasks) => [
        ...prev_tasks,
        data
      ]);
    });

    setSelected(true)
    console.log('tasks ', taskList)

 
  }

  const handleDelete = (key) => {
    console.log(key.name)
    setschemeData(schemeData.filter(function(element){
      return element.name != key.name
    }))

    settaskData(taskData.filter(function(element){
      return element.name != key.name
    }))

    const acc_new = accuracy.datasets.filter(function(element){
      return element.label != key.name
    })

    const test_loss_new = testLoss.datasets.filter(function(element){
      return element.label != key.name
    })

    const train_loss_new = trainLoss.datasets.filter(function(element){
      return element.label != key.name
    })

    const round_time_new = roundTime.datasets.filter(function(element){
      return element.label != key.name
    })
    
    setaccuracy({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: acc_new
    })

    settestLoss({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: test_loss_new
    })

    settrainLoss({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: train_loss_new
    })

    setroundTime({
      labels: Array.from(Array(maxN).keys()).map(v => v + 1),
      datasets: round_time_new
    })
    settasks(tasks.filter(function(element){
      return element.task.name != key.name
    }))
  //   setschemeData()
  //   {people: this.state.people.filter(function(person) { 
  //     return person !== e.target.value 
  // })}
  }

  return (


    <Content
      className="site-layout" style={{ padding: '0 50px', minHeight: '600px' }}
    >

      <Card title="Compare Tasks"
        headStyle={{ fontWeight: 800, fontSize: 24 }}
        bodyStyle={{ backgroundColor: 'white' }}
        bordered={true}
        style={{ width: '100%', boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}>

        <Row>
          <Col span={12} align="center">
            {/* <Search
              placeholder="Enter task name"
              enterButton="Search"

              style={{
                width: 300,

              }}
              onSearch={onSearch}

            /> */}

            <Select
              showSearch
              style={{ width: 500 }}
              placeholder="Enter task name"
              defaultActiveFirstOption={true}
              showArrow={false}
              filterOption={true}
              onChange={handleChange}
              notFoundContent={null}
              options={(taskList || []).map((d) => ({
                value: d.task_name,
                label: d.task_name,
              }))}
            />
            <Button type="primary" onClick={() => taskClick(search)} >Compare</Button>
          </Col>
        </Row>
        {!selected && <Space direction="horizontal" wrap style={{ display: 'flex', margin: '50px 10px' }}>

          {taskList.map(task =>

            <Card hoverable
              title={task.task_name} bordered={true}
              onClick={() => taskClick(task.task_name)}
            >

              {task.scheme_long}<br />
              {task.timestamp}

            </Card>)}


        </Space>}

        {mapped &&
          // <Space direction="horizontal" style={{ display: 'flex',marginTop:'10px' }}>
          <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: '50px' }}>


            <h1 >Task Overview</h1>
            {/* 
            <Table
              pagination={false}
              bordered
              dataSource={taskData} columns={task_columns} /> */}
            <TaskTable

              taskData={taskData}
              handleDelete = {handleDelete}
            />

            <h1 >Scheme Overview</h1>
            <Table
              pagination={false}
              bordered
              dataSource={schemeData} columns={scheme_columns} />
            <Row>
              <Col span={12}>
                <Line options={lossoptions} data={trainLoss} />
              </Col>
              <Col span={12}>
                <Line options={testlossoptions} data={testLoss} />
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Line options={roundTimeOptions} data={roundTime} />
              </Col>
              <Col span={12}>
                <Line options={accuracyOptions} data={accuracy} />
              </Col>
            </Row>


          </Space>

          // </Space>
        }




      </Card>

    </Content>
  )
}

export default Compare