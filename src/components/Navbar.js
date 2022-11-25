import React , { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Login from './Login';
import Register from './Register';
import { Row, Col, Button } from 'antd';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
 
const Navbar = ({ signOut, user }) => {
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

    if(user) { //If logged in
        return (
            <>
                <Row >
                    <Col span={4}><a href='./'>LOGO</a></Col>
                    <Col span={17}></Col>
                    <Col span={2}>
                        {user.username}
                    </Col>
                    <Col span={1}><Button  onClick={signOut} >Logout</Button></Col>
                </Row>
          </>
        );
      }
 
    else return ( //if not logged in
        <>
            <Row >
                <Col span={4}><a href='./'>LOGO</a></Col>
                <Col span={12}></Col>
                <Col span={4}></Col>
                <Col span={4}>
                <button onClick={signOut}>Sign out</button>
                </Col>
            </Row>
        </>
    )
}
 
export default withAuthenticator(Navbar)