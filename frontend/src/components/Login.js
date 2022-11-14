import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'antd';
 
const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', {
                email: email,
                password: password
            });
            if (window.location.pathname === "/"){ //If we are on the homepage, we need to navigate to the dashboard
                navigate("/Dashboard");
            }
            else{ //Otherwise, we need to reload
                window.location.reload(false);
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
      };

      const handleCancel = () => {
        setIsModalOpen(false);
      };
 
    return (
        <div className="column is-4-desktop">
            <Button type="primary" onClick={showModal} >
                Login
            </Button>
            <Modal title="Login Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <form onSubmit={Auth} className="box">
                    <p className="has-text-centered">{msg}</p>
                    <div className="field mt-5">
                        <label className="label">Email or Username</label>
                        <div className="controls">
                            <input type="text" className="input" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className="label">Password</label>
                        <div className="controls">
                            <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button className="button is-success is-fullwidth">Login</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
 
export default Login