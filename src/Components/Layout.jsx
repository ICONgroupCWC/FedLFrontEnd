import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import {
  HomeOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Icon } from 'antd';
import React from 'react';
import Dashboard from "./Dashboard";
import Task from "./TaskComponent";
import '../styles/Layout.css'
const { Header, Content, Footer, Sider } = Layout;

// const items = [
//   HomeOutlined
// ].map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));


const AppLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Router>
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            
          }}
        >
          {<div
            style={{
              height: 32,
              margin: 16,
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />}
          <Menu className='vertical-center' theme="dark" mode="inline">

            <Menu.Item className='vertical-center' theme="dark" mode="inline" key="1">
              <HomeOutlined />
              <span>Dashboard</span>
              <Link to="/dashboard" />
            </Menu.Item>

            <Menu.Item className='vertical-center' theme="dark" mode="inline" key="2">
              <ProfileOutlined />
              <span>New Task</span>
              <Link to="/task" />
            </Menu.Item>

          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: "#e6f4ff",
            }}
          />
          {/* <Content
            style={{
              margin: '24px 16px 0',
              overflow: 'initial',
            }}
          >
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                background: colorBgContainer,
              }}
            >
              <p>long content</p>
              {
                // indicates very long content
                Array.from(
                  {
                    length: 100,
                  },
                  (_, index) => (
                    <React.Fragment key={index}>
                      {index % 20 === 0 && index ? 'more' : '...'}
                      <br />
                    </React.Fragment>
                  ),
                )
              }
            </div>
          </Content> */}
          <Content style={{background:"#e6f4ff"}} >
          <Routes>
            <Route exact path="/dashboard" element={<Dashboard/>} />
            <Route path="/task" element={<Task/>} />
            </Routes>
          </Content>

          <Footer
            style={{
              textAlign: 'center',
              background: "#e6f4ff"
            }}
          >
            
          </Footer>
        </Layout>
      </Layout>
    </Router>

  );
};
export default AppLayout;