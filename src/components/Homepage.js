/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { Layout, Row, Col, Button } from 'antd';
 
const Homepage = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { Header, Footer, Sider, Content } = Layout;
 
    useEffect(() => {
        refreshToken();
    }, []);
 
    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:4000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                //alert("error with msg: ", error.response); //(use this to see the errors in action)
                /*
                Ideally, we want to refresh the homepage when the token expires, but, right now, there are two errors that come in before the page is ok.
                The errors contain no text in the error.response but are visible in the Console Log. They appear to be backend based. Supposedly, in RefreshToken.js, 
                we are doing something that causes the server to respond with a status of 401 (Unauthorized).
                */
                navigate("/");
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

    const goToDashboard = () => {
        navigate("/Dashboard");
    };
    
    if(name){
        return (
            <>
            <Layout className="layout">
                <Header style={{ backgroundColor: '#b6d7a8' }}>
                    <Navbar />
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <p>Welcome to your homepage, {name}</p>
                        <Button type="primary" onClick={goToDashboard} >
                            Click to Travel to Dashboard
                        </Button>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Luis Sergovia Fan Club ©2022 Created by James Redding & Maxwell Ryan</Footer>
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
                        <p>Welcome to the homepage. You are not logged in.</p>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Luis Sergovia Fan Club ©2022 Created by James Redding & Maxwell Ryan</Footer>
            </Layout>
            </>
        )
    }
}
 
export default Homepage