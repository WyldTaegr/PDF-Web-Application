/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { Breadcrumb, Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const endpoint = "http://localhost:3000"

 
const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [numPdf, setNumPdf] = useState(4);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loaded, setLoaded] = useState(0);
 
    useEffect(() => {
        refreshToken();
    }, []);

    

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
 
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:4000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
            }
        }
    }

    const axiosJWT = axios.create();
 
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:4000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
    };

    const handleUpload = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)
        axios.post(endpoint, data, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                })
            },
        })
          .then(res => {
            console.log(res.statusText)
        })
    }

    const handleSelectedFile = event => {
        this.setState({
          selectedFile: event.target.files[0],
          loaded: 0,
        })
    }
 
    return (
        <>
        <Layout className="layout">
            <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar/>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Layout>
                <Row >
                    <Col flex={1}>This is your Dashboard </Col>
                    <Col flex={0}>
                            <Button type="primary" onClick={showModal} >
                                upload
                            </Button>
                            <Modal title="Upload Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
                                <form onSubmit={handleUpload} className="box">
                                    <p className="has-text-centered">{msg}</p>
                                    <label className="label">Upload a pdf</label>
                                    <div className="controls">
                                        <input type="file" accept=".pdf" className="input" placeholder="Username" value={selectedFile} onChange={handleSelectedFile} />
                                    </div>
                                    <button className="button is-success is-fullwidth">Upload</button>
                                </form>
                            </Modal>
                        </Col>
                </Row>
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