import { Breadcrumb, Layout, Button, Modal, Space, Divider, Row, Col, Table, Tag } from 'antd';
import { Auth, Amplify, Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react'
import awsExports from '../aws-exports';
import { PutObjectCommand } from "@aws-sdk/client-s3";

Storage.configure({ level: 'protected' });

const Upload = ({}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setIsModalOpen(false);
    };

    async function handleUpload(e) {
        const file = e.target.files[0];
        try {
        const result = await Amplify.Storage.put(file.name, file, {
            level: "private",
          });
        } catch (error) {
          console.log("Error uploading file: ", error);
        }
        handleCancel()
    }

    return (
    <>
        <Button type="primary" onClick={showModal}>
            Upload
        </Button>
        <Modal title="Select PDF" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <input type="file" accept=".pdf" className="input" placeholder="Username" value={selectedFile} onChange={handleUpload} />
        </Modal>
    </>
    )
}

export default Upload