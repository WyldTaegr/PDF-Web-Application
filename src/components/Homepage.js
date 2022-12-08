/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { Layout, Card, Row, Col } from 'antd';
import { Auth, Amplify } from 'aws-amplify';
import '../CSS/HeroImage.css';
 
const Homepage = ({}) => {
    const navigate = useNavigate();
    const { Header, Footer, Content } = Layout;

    const goToDashboard = () => {
        navigate("/Dashboard");
    };

    return (
        <>
        <Layout className="layout">
        <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar />
            </Header>
            <Content>
                <div style={{ height: '80vh' }}>
                    <div className='hero-image'>
                        <p className='hero-text-title'>Welcome to the Homepage</p>
                        <button className='hero-button' onClick={goToDashboard} >
                            Travel to Dashboard
                        </button>
                    </div>
                </div>
                <div>
                    <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    </Row>
                    <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                        Card content
                        </Card>
                    </Col>
                    </Row>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding, Maxwell Ryan, Kerry Nettles, Tiger Tian, Hiroki Nakayama, & Kieran Williams</Footer>
        </Layout>
        </>
    )
}
 
export default Homepage