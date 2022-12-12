/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { Carousel, Layout, Card, Row, Col } from 'antd';
import '../CSS/HomepageStyles.css';
import JamesPic from '../images/james.jpg';
import MaxPic from '../images/max.jpg';
import KerryPic from '../images/kerry.jpg';
import TigerPic from '../images/tiger.jpg';
import HirokiPic from '../images/hiroki.jpg';
import KierenPic from '../images/kieren.jpg';
import mergeGraphic from '../images/mergeGraphic.png'
import splitGraphic from '../images/splitGraphic.svg'
import shareGraphic from '../images/shareGraphic.svg'
 

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const Homepage = ({}) => {
    const navigate = useNavigate();
    const { Header, Footer, Content } = Layout;

    const goToDashboard = () => {
        navigate("/Dashboard");
    };

    return (
        <>
        <Layout style={{minHeight:"100vh"}}>
        <Header style={{ backgroundColor: '#b6d7a8' }}>
                <Navbar />
            </Header>
            <Content>
                <div style={{ height: '85vh' }}>
                    <div className='hero-image'>
                        <p className='hero-text-title'>Welcome to the Homepage</p>
                        <button className='hero-button' onClick={goToDashboard} >
                            Travel to Dashboard
                        </button>
                    </div>
                </div>
                <div className='hero-section'>
                    <p className='hero-section-title'>PDF-inator</p>
                    <p>Organize and edit your documents with ease!</p>
                    <Carousel autoplay dotPosition='bottom'>
                      <div className='carousel-section'>
                        <img className='carousel-image' src={mergeGraphic} alt='merge graphic' />
                        <h3 style={contentStyle}>Consolidate your documents with the click of a button!</h3>
                      </div>
                      <div className='carousel-section'>
                        <img className='carousel-image' src={splitGraphic} alt='split graphic' />
                        <h3 style={contentStyle}>Split your document to easily grab the important pieces!</h3>
                      </div>
                      <div className='carousel-section'>
                        <img className='carousel-image' src={shareGraphic} alt='share graphic' />
                        <h3 style={contentStyle}>Share your results instantly with colleagues!</h3>
                      </div>
                    </Carousel>
                </div>
                <div className='hero-section'>
                    <p className='hero-section-title'>Meet the Team</p>
                    <Row gutter={[16, 24]}>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="Tiger Tian"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={TigerPic}
                            />
                          }>
                        Product Manager
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="Kerry Nettles"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={KerryPic}
                            />
                          }>
                        Scrum Master
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="James Redding"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={JamesPic}
                            />
                          }>
                        Frontend Developer
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="Maxwell Ryan"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={MaxPic}
                            />
                          }>
                        Frontend Developer
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="Hiroki Nakayama"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={HirokiPic}
                            />
                          }>
                        Backend Developer
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                        hoverable 
                        title="Kieran Williams"
                        cover={
                            <img
                            style={{ height: "30vh", objectFit: "cover" }}
                              alt="example"
                              src={KierenPic}
                            />
                          }>
                        Backend Developer
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