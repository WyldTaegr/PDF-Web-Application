/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar";
import { Auth, Amplify, Storage } from 'aws-amplify';
import { Breadcrumb, Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
Storage.configure({ level: 'protected' });

const Dashboard = ({user}) => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [numPdf, setNumPdf] = useState(4);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loaded, setLoaded] = useState(0);
    const [pdflist, setPdfList] = useState(new Array());
    const displayColumns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Size',
          dataIndex: 'size',
          key: 'size',
        },
        {
          title: 'Last Edited:',
          dataIndex: 'lastedit',
          key: 'lastedit',
        }
    ];

    const handleCancel = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
        getList();
    };

    async function handleUpload(e) {
        const file = e.target.files[0];
        let key = file.name
        console.log("key: " + key)
        try {
            await Storage.put(file.name, file, {
              contentType: "application/pdf", // contentType is optional
            });
          } catch (error) {
            console.log("Error uploading file: ", error);
          }
        handleCancel()
    }

    useEffect(() => {
        Storage.list('', { level: 'protected' })
            .then(({ results }) => {
            console.log(results)
            const pdfListData = new Array(results.legnth)
            for (let index = 0; index < results.length; index++) {
                pdfListData[index] = {
                key: index.toString,
                name: results[index].key,
                size: results[index].size + ' B',
                lastedit: results[index].lastModified.toISOString()
            }
            setPdfList(pdfListData)
        }
        });
        console.log(pdflist)
    }, []);
     
    function getList() {
        Storage.list('', { level: 'protected' })
            .then(({ results }) => {
            console.log(results)
            const pdfListData = new Array(results.legnth)
            for (let index = 0; index < results.length; index++) {
                pdfListData[index] = {
                key: index.toString,
                name: results[index].key,
                size: results[index].size + ' B',
                lastedit: results[index].lastModified.toISOString()
            }
            setPdfList(pdfListData)
        }
        });
        console.log(pdflist)
    }
    return (
        <>
        <Layout className="layout">
            <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar/>
                <Col flex={0}>
                    <input type="file" accept=".pdf" className="input" placeholder="Username" value={selectedFile} onChange={handleUpload} />
                </Col>
            </Header>       
            <Content style={{ padding: '0 50px' }}>
                <Layout>
                <Divider />
                <div className="site-layout-content">
                    <Table columns={displayColumns} dataSource={pdflist} />
                </div>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding & Maxwell Ryan</Footer>
        </Layout>
        </>
    )
}
 
export default Dashboard