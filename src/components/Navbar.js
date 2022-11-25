import React , { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
 
const Navbar = ({ signOut, user }) => {

    const navigate = useNavigate();

    const handleSignOut = () => {
        goToHomePage()
        signOut()
    };

    const goToHomePage = () => {
        navigate("/");
    };

    if(user) { //If logged in
        return (
            <>
                <Row >
                    <Col span={4}><a href='./'>LOGO</a></Col>
                    <Col span={17}></Col>
                    <Col span={2}>
                        {user.username}
                    </Col>
                    <Col span={1}><Button  onClick={handleSignOut} >Logout</Button></Col>
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
                </Col>
            </Row>
        </>
    )
}
 
export default withAuthenticator(Navbar)