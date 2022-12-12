/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import Navbar from "./Navbar";
import { Auth, Storage } from 'aws-amplify';
import { Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag, Input, InputNumber } from 'antd';
import moment from 'moment';
import { PDFDocument } from 'pdf-lib';
const { Header, Footer, Content } = Layout;
Storage.configure({ level: 'public' });

const Dashboard = () => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isMergeOpen, setIsMergeOpen] = useState(false);
    const [isSplitOpen, setIsSplitOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isMergeSelectOpen, setIsMergeSelectOpen] = useState(false);
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [loaded, setLoaded] = useState(0);
    const [loadedKey, setLoadedKey] = useState(0);
    const [pdfList, setPdfList] = useState(new Array());
    const [pdfString, setPdfString] = useState('')
    const [shareDialog, setShareDialog] = useState(false)
    const [shareString, setShareString] = useState('')
    const [shareMsg, setShareMsg] = useState("")
    const [splitIndex, setSplitIndex] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [mergeTarget, setMergeTarget] = useState('None')
    const [tag1, setTag1] = useState('')
    const [tag2, setTag2] = useState('')
    const [tag3, setTag3] = useState('')
    
    async function handleDownload(e) {
        const result = await Storage.get(e, {download: true});
        setLoaded(result)
        const url = URL.createObjectURL(result.Body);
        setPdfString(url)
        setLoadedKey(e)
        const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
        const documentBase = await PDFDocument.load(arrayBuffer)
        setPageCount(documentBase.getPageCount())
        setTag1(result.Metadata[1])
        setTag2(result.Metadata[2])
        setTag3(result.Metadata[3])
        setIsPreviewOpen(true)
    }

    async function handleUpload(fileIn) {
        console.log(fileIn)
        const file = fileIn;
        const user = await Auth.currentAuthenticatedUser();
        let key = user.username +'/' + file.name
        key = await nameDocument(key)
        console.log("tags @ upload: " + tag1 + ", " +tag2 + ", " + tag3)
        if (file) {
            try {
                await Storage.put(key, file, {
                  contentType: "application/pdf", // contentType is optional
                  metadata: {
                  ['1']: tag1.toString(),
                  ['2']: tag2.toString(),
                  ['3']: tag3.toString()
                }  
                });
              } catch (error) {
                console.log("Error uploading file: ", error);
              }
            handleCancel()
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const user = await Auth.currentAuthenticatedUser();
            const key = user.username + '/'
            const list = await Storage.list(key, { level: 'public', pageSize: 'ALL' })
            const numpdf = list.results.length
            const pdfListData = new Array(numpdf)
            for (let index = 0; index < numpdf; index++) {
                const realName = list.results[index].key
                let obj = await Storage.get(realName, {download: true})
                let tagList = new Array(3)
                for (let i = 1; i < 4; i++) {
                    tagList[i-1] = obj.Metadata[i]
                }
                pdfListData[index] = {
                    key: index.toString,
                    s3key: realName,
                    name: realName.substring(key.length),
                    size: list.results[index].size + ' B',
                    lastedit: moment(list.results[index].lastModified.toISOString()).format('MMMM Do YYYY, h:mm a'),
                    tags: tagList
                }
            }
            setPdfList(pdfListData)
        }
        fetchData()
    }, [pdfList]);
     
    async function getList() {
        const user = await Auth.currentAuthenticatedUser();
            const key = user.username + '/'
            const list = await Storage.list(key, { level: 'public', pageSize: 'ALL' })
            const numpdf = list.results.length
            const pdfListData = new Array(numpdf)
            for (let index = 0; index < numpdf; index++) {
                const realName = list.results[index].key
                let obj = await Storage.get(realName, {download: true})
                let tagList = new Array(3)
                for (let i = 1; i < 4; i++) {
                    tagList[i-1] = obj.Metadata[i]
                }
                pdfListData[index] = {
                    key: index.toString,
                    s3key: realName,
                    name: realName.substring(key.length),
                    size: list.results[index].size + ' B',
                    lastedit: moment(list.results[index].lastModified.toISOString()).format('MMMM Do YYYY, h:mm a'),
                    tags: tagList
                }
            }
            setPdfList(pdfListData)
    }

    async function nameDocument(intitialKey) {
        let exists = false
        const doc = await Storage.get(intitialKey, {download: true})
        .then( res => {
            exists = true;
        } )
        .catch( error => { 
            exists = false;
        })
        if (exists) {
            const strippedName = intitialKey.substring(0, intitialKey.length-4)
            const lastChar = strippedName.substring(strippedName.length -1)
            console.log("Stripped Name: " + strippedName)
            console.log('Last Char: ' + lastChar)
            const integerValue = parseInt(lastChar)
            let newName = ""
            if (isNaN(integerValue)) {
                console.log("First Rename Cycle")
                newName = strippedName + "1"
            } else if (integerValue == 9) {
                newName = strippedName.substring(0, intitialKey.length -1)
                newName = newName.substring(0, newName.length -1) + "10"
            } else {
                newName = strippedName.substring(0, intitialKey.length -1)
                let num = integerValue + 1
                num = num.toString()
                newName = newName.substring(0, newName.length -1) + num
            }
            newName = newName + ".pdf"
            console.log("rerun with name: " + newName)
            return nameDocument(newName)
        } else {
            console.log('No Duplicates Found: '+ intitialKey)
            return intitialKey
        }
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
        const user = await Auth.currentAuthenticatedUser();
        const userExists = await userExist(shareString)
        const key = await nameDocument(shareString + '/' + loadedKey.slice(user.username.length + 1))
        if (userExists) {
            try {
                console.log("putting document at: " + key)
                await Storage.put(key , loaded.Body, {
                  contentType: "application/pdf", // contentType is optional
                });
                setShareMsg("")
                closeShareDialog()
                handleCancel()
              } catch (error) {
                setShareMsg("Error uploading file: " + error)
                console.log("Error uploading file: ", error);
              }
        } else {
            setShareMsg("Invalid User")
        }
    }

    async function deleteActive() {
        await Storage.remove(loadedKey)
        handleCancel()
        closePreview()
        setLoaded('')
        setLoadedKey('')
        closeDelete()
    }
    
    const handleSelectedFile = (e) => {
       setSelectedFile(e.target.files[0])
    }

    async function mergeDocument() {

        const mergedPdf = await PDFDocument.create();
        const mergeBaseString = pdfString
        const arrayBuffer = await fetch(mergeBaseString).then(res => res.arrayBuffer())
        const secondDocument = await Storage.get(mergeTarget, {download: true});
        const mergeTargetString = URL.createObjectURL(secondDocument.Body);
        const secondArrayBuffer = await fetch(mergeTargetString).then(res => res.arrayBuffer())
        const documentBase = await PDFDocument.load(arrayBuffer)
        const documentTarget = await PDFDocument.load(secondArrayBuffer)

        let tagList = new Array(3)
        for (let i = 1; i < 4; i++) {
            tagList[i-1] = loaded.Metadata[i]
        }

        const copiedBase = await mergedPdf.copyPages(documentBase, documentBase.getPageIndices())
        copiedBase.forEach((page) => mergedPdf.addPage(page))

        const coppiedTarget = await mergedPdf.copyPages(documentTarget, documentTarget.getPageIndices())
        coppiedTarget.forEach((page) => mergedPdf.addPage(page))

        const pdfBytes = await mergedPdf.save()

        let mergedName = loadedKey.substring(0, loadedKey.length-4) + "_merged.pdf"
        console.log(mergedName)
        const key = await nameDocument(mergedName)
        console.log(mergedName)

        try {
            await Storage.put(key, pdfBytes, {
              contentType: "application/pdf", // contentType is optional
              metadata: {
                ['1']: tagList[0],
                ['2']: tagList[1],
                ['3']: tagList[2]
              }
            });
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        closeMerge()
        handleCancel()
    }

    async function splitDocument() {
        const arrayBuffer = await fetch(pdfString).then(res => res.arrayBuffer())
        const documentBase = await PDFDocument.load(arrayBuffer)
        const totalPages = documentBase.getPageCount()
        if(splitIndex >= totalPages || splitIndex <= 0){
            return;
        } else {
            closeSplit()

            const subDocument1 = await PDFDocument.create();
            const subDocument2 = await PDFDocument.create();
            
            console.log("Total Pages: " + totalPages)

            let tagList = new Array(3)
            for (let i = 1; i < 4; i++) {
                tagList[i-1] = loaded.Metadata[i]
            }
    
            for(let i = 0; i < splitIndex; i++){
                const [partedPage] = await subDocument1.copyPages(documentBase, [i])
                subDocument1.addPage(partedPage)
            }

            for(let i = splitIndex; i < totalPages; i++){
                const [partedPage2] = await subDocument2.copyPages(documentBase, [i])
                subDocument2.addPage(partedPage2)
            }
            const mergedPDFHalf = await subDocument1.save();
            const mergedPDFHalf2 = await subDocument2.save();

            let key = await nameDocument(loadedKey.substring(0, loadedKey.length -4) + "_head.pdf")
            let key2 = await nameDocument(loadedKey.substring(0, loadedKey.length -4) + "_tail.pdf")
            
            try {
                await Storage.put(key, mergedPDFHalf, {
                    contentType: "application/pdf", // contentType is optional   
                    metadata: {
                        ['1']: tagList[0],
                        ['2']: tagList[1],
                        ['3']: tagList[2]
                    } 
                });
                await Storage.put(key2, mergedPDFHalf2, {
                    contentType: "application/pdf", // contentType is optional
                    metadata: {
                        ['1']: tagList[0],
                        ['2']: tagList[1],
                        ['3']: tagList[2]
                    } 
                });
            } catch (error) {
                console.log("Error uploading file: ", error);
            }
        }
        closePreview()
        handleCancel()
    }
    
    async function submitTagChange() {
        try {
            await Storage.put(loadedKey, loaded.Body, {
                contentType: "application/pdf", // contentType is optional
                metadata: {
                    ['1']: tag1.toString(),
                    ['2']: tag2.toString(),
                    ['3']: tag3.toString()
                }  
            });
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        closeTagMenu()
        getList()
    }

    const handleCancel = () => {
        closeUpload()
        getList()
    };

    const closePreview = () => {
        setIsPreviewOpen(false)
        setTag1('')
        setTag2('')
        setTag3('')
    }
    
    const showShareDialog = () => {
        setShareDialog(true)
    }

    const closeShareDialog = () => {
        setShareDialog(false)
    }

    const showUpload = () => {
        setIsUploadOpen(true)
    }

    const closeUpload = () => {
        setIsUploadOpen(false)
    }

    const showMergeSelect = () => {
        console.log()
        setMergeTarget(null)
        setIsMergeSelectOpen(true)
    }

    const closeMergeSelect = (e) => {
        setMergeTarget(e)
        setIsMergeSelectOpen(false)
    }

    const showMerge = () => {
        setIsMergeOpen(true)
    }

    const closeMerge = () => {
        setMergeTarget('None')
        setIsMergeOpen(false)
    }

    const showSplit = () => {
        setIsSplitOpen(true)
    }

    const closeSplit = () => {
        console.log("split index: " + splitIndex)
        setIsSplitOpen(false)
    }

    const showTagMenu = () => {
        setIsTagMenuOpen(true)
    }

    const closeTagMenu = () => {
        setIsTagMenuOpen(false)
    }

    const showDelete = () => {
        setIsDeleteOpen(true)
    }

    const closeDelete = () => {
        setIsDeleteOpen(false)
    }

    return (
        <>
        <Layout className="layout" style={{minHeight:"100vh"}}>
            <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar/>
            </Header>       
            <Content style={{ padding: '0 50px' }}>
                <Layout>
                    <Modal title="Document Preview" open={isPreviewOpen} onCancel={closePreview} footer={null} centered='true' width='1200'>
                        <Row>
                            <Col span={2}><Button onClick={showShareDialog}>Share</Button></Col>
                            <Col span={2}><Button onClick={showMerge}>Merge</Button></Col>
                            <Col span={2}><Button onClick={showSplit}>Split</Button></Col>
                            <Col span={2}><Button onClick={showTagMenu}>Edit Tags</Button></Col>
                            <Col span={2}><Button onClick={showDelete}>Delete</Button></Col>
                        </Row>
                        <Divider />
                        <Row><embed src={pdfString} width="1200" height="550"></embed></Row>
                    </Modal>
                    <Divider />
                    <Button onClick={showUpload}>Upload</Button>
                    <Divider />
                    <Modal title="Share" open={shareDialog} onCancel={closeShareDialog} footer={null} centered='true' width='120'>
                            <div>
                                <div>{shareMsg}</div>
                                <input type="text" id="username" value={shareString} placeholder="Target Username" onChange={(e)=>setShareString(e.target.value)}/>
                                <Button onClick={shareDocument}>Confirm</Button>
                            </div>
                    </Modal>
                    <Modal title="Merge" open={isMergeOpen} onCancel={closeMerge} footer={null} centered='true' width='120'>
                        <Space direction='vertical'>
                        <div>{"Merge Target: " + mergeTarget}</div>
                        <div></div>
                        <Col span={2}><Button onClick={showMergeSelect}>Select Second Document</Button></Col>
                        <Divider />
                        <Col span={2}><Button onClick={mergeDocument}>Confirm</Button></Col>
                        </Space>
                        <Modal title="Merge Select" open={isMergeSelectOpen} onCancel={closeMergeSelect} footer={null} centered='true'>
                            <Table columns={[{
                                title: 'Name',
                                dataIndex: 'name',
                                key: 'name',
                                render: (text, record) => <Button type="primary" onClick={(e)=>closeMergeSelect(record.s3key)}>{text}</Button>
                            }]} dataSource={pdfList} />
                        </Modal>
                    </Modal>
                    <Modal title="Split" open={isSplitOpen} onCancel={closeSplit} footer={null} centered='true' width='120'>
                        <div>Split at Page:</div>
                        <InputNumber min={1} max={pageCount} defaultValue={null} onChange={(e) => setSplitIndex(e)} />
                        <Divider />
                        <Button onClick={splitDocument}>Confirm</Button>
                    </Modal>
                    <Modal title="Change Tags" open={isTagMenuOpen} onCancel={closeTagMenu} footer={null} centered='true'>
                        <Space direction="vertical">
                            <input type="text" id="tag1" value={tag1} placeholder="Tag 1" onChange={(e)=>setTag1([e.target.value])}/>
                            <input type="text" id="tag2" value={tag2} placeholder="Tag 2" onChange={(e)=>setTag2([e.target.value])}/>
                            <input type="text" id="tag3" value={tag3} placeholder="Tag 3" onChange={(e)=>setTag3([e.target.value])}/>
                            <Button onClick={submitTagChange}>Confirm</Button>
                        </Space>
                    </Modal>
                    <Modal title="Upload Document" open={isUploadOpen} onCancel={closeUpload} footer={null} centered='true' width='120'>
                        <Row>
                            <Col>
                                <Space direction="vertical">
                                    <label className="label">Upload a pdf</label>
                                    <input type="file" accept=".pdf" className="input" placeholder="Username" onChange={handleSelectedFile} />
                                    <button onClick={() => handleUpload(selectedFile)}>Confirm</button>
                                </Space>
                            </Col>
                            <Col >
                                <Space direction="vertical">
                                    <input type="text" id="tag1" value={tag1} placeholder="Tag 1" onChange={(e)=>setTag1([e.target.value])}/>
                                    <input type="text" id="tag2" value={tag2} placeholder="Tag 2" onChange={(e)=>setTag2([e.target.value])}/>
                                    <input type="text" id="tag3" value={tag3} placeholder="Tag 3" onChange={(e)=>setTag3([e.target.value])}/>
                                </Space>
                            </Col>
                        </Row>
                    </Modal>
                    <Modal title="Delete" open={isDeleteOpen} onCancel={closeDelete} footer={null} centered='true' width='120'>
                        <Button onClick={deleteActive}>Confirm</Button>
                    </Modal>
                <div className="site-layout-content">
                    <Table columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => <Button type="primary" onClick={async () => {await handleDownload(record.s3key);}}>{text}</Button>
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
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
              <Space size = "middle">
                <Tag>{tags[0] && tags[0].toUpperCase()}</Tag>
                <Tag>{tags[1] && tags[1].toUpperCase()}</Tag>
                <Tag>{tags[2] && tags[2].toUpperCase()}</Tag>
              </Space>
            ),
          }
    ]} dataSource={pdfList} /> </div>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding, Maxwell Ryan, Kerry Nettles, Tiger Tian, Hiroki Nakayama, & Kieran Williams</Footer>
        </Layout>
        </>
    )
}
 
export default Dashboard
