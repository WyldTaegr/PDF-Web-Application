/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Upload from "./Upload"
import { Auth, Amplify } from 'aws-amplify';
import { Breadcrumb, Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

 
const Dashboard = ({user}) => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [numPdf, setNumPdf] = useState(4);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loaded, setLoaded] = useState(0);

    

    const displayColumns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Length',
          dataIndex: 'length',
          key: 'length',
        },
        {
          title: 'Last Edited:',
          dataIndex: 'lastedit',
          key: 'lastedit',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          render: (_, { tags }) => (
            <Space size = "middle">
              {tags.map((tag) => {
                let color;
                //TODO: Generalize with user tags
                switch (tag) {
                    case 'tag1': color = 'green' 
                        break;
                    case 'tag2': color = 'cadetblue'
                        break;
                    case 'tag3': color = 'crimson'
                        break;
                    case 'tag4': color = 'blue'
                        break;
                    case 'math': color = 'blue'
                        break;
                    case 'urgent': color = 'red'
                        break;
                    default: color = 'black'
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </Space>
          ),
        }
    ];
      
    const pdfListData = new Array(numPdf);
    
    //TODO: Get document specific data from index
    
    for (let index = 0; index < pdfListData.length; index++) {
        pdfListData[index] = {
        key: index.toString,
        name: 'Document ' + index,
        length: 42,
        lastedit:'Just Now',
        tags: ['tag1', 'tag2', 'tag4']
        }
    }

    async function getUserName () { 
        let user = await Auth.currentAuthenticatedUser();
        const { attributes } = user;
        return attributes;
    }  
 
    return (
        <>
        <Layout className="layout">
            <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar/>
                <Col flex={0}><Upload/></Col>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout>
                <Divider />
                <div className="site-layout-content">
                    <Table columns={displayColumns} dataSource={pdfListData} />
                </div>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Luis Sergovia Fan Club ©2022 Created by James Redding & Maxwell Ryan</Footer>
        </Layout>
        </>
    )
}
 
export default Dashboard