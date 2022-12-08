/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { Layout } from 'antd';
import { Auth, Amplify } from 'aws-amplify';
import '../CSS/HeroImage.css';
 
const Homepage = ({}) => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { Header, Footer, Sider, Content } = Layout;

    async function getUser () { 
        const user = await Auth.currentAuthenticatedUser();
        return user
    }

    const goToDashboard = () => {
        navigate("/Dashboard");
    };

    if(getUser){
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
                                Click to Travel to Dashboard
                            </button>
                        </div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding, Maxwell Ryan, Kerry Nettles, Tiger Tian, Hiroki Nakayama, & Kieran Williams</Footer>
            </Layout>
            </>
        )
    }
    else{
        return (
            <>
            <Layout className="layout">
                <Header style={{ backgroundColor: '#b6d7a8' }}>
                    <Navbar />
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <p></p>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Luis Segovia Fan Club ©2022 Created by James Redding, Maxwell Ryan, Kerry Nettles, Tiger Tian, Hiroki Nakayama, & Kieran Williams</Footer>
            </Layout>
            </>
        )
    }
}
 
export default Homepage