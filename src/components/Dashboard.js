/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar";
import { Auth, Amplify, Storage } from 'aws-amplify';
import { Breadcrumb, Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag } from 'antd';
import { ALLOWED_SPECIAL_CHARACTERS } from '@aws-amplify/ui';
const { Header, Footer, Sider, Content } = Layout;
Storage.configure({ level: 'protected' });

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loaded, setLoaded] = useState(0);
    const [loadedKey, setLoadedKey] = useState(0);
    const [pdflist, setPdfList] = useState(new Array());
    const [pdfString, setPdfString] = useState('')
    const [shareDialog, setShareDialog] = useState(false)
    const [shareString, setShareString] = useState('')

    

    const handleCancel = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
        getList();
    };

    const closePreview = () => {
        setIsPreviewOpen(false)
    }

    const showPreview = () => {
        setIsPreviewOpen(true)
    }
    
    async function handleDownload(e) {
        const result = await Storage.get(e, {download: true});
        const url = URL.createObjectURL(result.Body);
        setPdfString(url)
        setLoadedKey(e)
        setIsPreviewOpen(true)
    }

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
            //console.log(results)
            const pdfListData = new Array(results.legnth)
            for (let index = 0; index < results.length; index++) {
                pdfListData[index] = {
                key: index.toString,
                name: results[index].key,
                size: results[index].size + ' B',
                lastedit: results[index].lastModified.toISOString(),
            }
            setPdfList(pdfListData)
        }
        });
        //console.log(pdflist)
    }, []);
     
    function getList() {
        Storage.list('', { level: 'protected' })
            .then(({ results }) => {
            //console.log(results)
            const pdfListData = new Array(results.legnth)
            for (let index = 0; index < results.length; index++) {
                pdfListData[index] = {
                key: index.toString,
                name: results[index].key,
                size: results[index].size + ' B',
                lastedit: results[index].lastModified.toISOString(),
                download: 'download'
            }
            setPdfList(pdfListData)
        }
        });
        //console.log(pdflist)
    }

    function saveDocumentAsync(body, filename) {
        const url = URL.createObjectURL(body);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'download';
        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
    }

    async function saveDocument(e) {
        const result = await Storage.get(e, { download: true });
        saveDocumentAsync(result.Body, e);
    }

    const handleCancelShareDialog = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
        getList();
    };

    const closeShareDialog = () => {
        setShareDialog(false)
    }

    const showShareDialog = () => {
        setShareDialog(true)
    }

    async function userExist(userName) {
        return Auth.signIn( userName, ' ')
        .then( res => {
            return false;
        } )
        .catch( error => {
            const code = error.code;
            console.log( error );
            switch ( code ) {
                case 'NotAuthorizedException':
                    return true;
                default:
                    return false;
            }
        } );
    }

    async function shareDocument(event) {
        event.preventDefault();
        const userExists = await userExist(shareString)
        if (userExists) {
            //Only entered if user exists
        }
        
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
                    <Modal title="Document Preview" open={isPreviewOpen} onCancel={closePreview} footer={null} centered='true' width='1200'>
                        <Row><Button onClick={showShareDialog}>Share</Button></Row><Divider />
                        <Modal title="Share" open={shareDialog} onCancel={closeShareDialog} footer={null} centered='true' width='120'>
                            <form onSubmit={shareDocument}>
                                <input type="text" id="username" value={shareString} placeholder="Target Username" onChange={(e)=>setShareString(e.target.value)}/>
                                <input type="submit" value="Submit" />
                            </form>
                        </Modal>
                        <Row><embed src={pdfString} width="1200" height="550"></embed></Row>
                    </Modal>
                    <Divider />
                <div className="site-layout-content">
                    <Table columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <Button type="primary" onClick={async () => {await handleDownload(text);}}>{text}</Button>
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
    ]} dataSource={pdflist} /> </div>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding & Maxwell Ryan</Footer>
        </Layout>
        </>
    )
}
 
export default Dashboard