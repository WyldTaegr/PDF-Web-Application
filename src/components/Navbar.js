import React , { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
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
                    <Col span={4}><Link to="..">
                    <HomeOutlined 
                    style={{ fontSize: "32px" }}
                    />
                    </Link></Col>
                    <Col span={16}>
                        <h1 style={{ textAlign: "center"}}>PDF Manipulator Tool</h1>
                    </Col>
                    <Col span={4} style={{ textAlign: "right"}}><Button onClick={handleSignOut} >Logout {user.username}</Button></Col>
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