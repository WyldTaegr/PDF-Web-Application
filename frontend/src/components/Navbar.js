import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Login from './Login';
import Register from './Register';
import { Row, Col, Button } from 'antd';
 
const Navbar = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();
 
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

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:4000/logout');
            setName({});
            if (window.location.pathname === "/"){ //If we are on the homepage, we need to reload
                window.location.reload(false);
            }
            else{ //Otherwise, we need to navigate to the homepage
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    }
    if(name) { //If logged in
        return (
            <>
                <Row >
                    <Col span={4}><a href='./'>LOGO LINK</a></Col>
                    <Col span={16}></Col>
                    <Col span={4}>
                        {name} is loggged in
                        <Button type="primary" onClick={Logout} >
                            Logout
                        </Button>
                    </Col>
                </Row>
          </>
        );
      }
 
    else return ( //if not logged in
        <>
            <Row >
                <Col span={4}><a href='./'>LOGO LINK</a></Col>
                <Col span={12}></Col>
                <Col span={4}>
                    <Register />
                </Col>
                <Col span={4}>
                    <Login />
                </Col>
            </Row>
        </>
    )
}
 
export default Navbar