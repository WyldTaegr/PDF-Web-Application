import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'antd';
 
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
 
 
    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword
            });
            if (window.location.pathname === "/"){ //If we are on the homepage, we need to reload
                window.location.reload(false);
            }
            else{ //Otherwise, we need to navigate to the homepage
                navigate("/");
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
        <>
        <Button type="primary" onClick={showModal} >
            Register
        </Button>
        <Modal title="Registration Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <form onSubmit={Register} className="box">
                <p className="has-text-centered">{msg}</p>
                    <div className="field mt-5">
                        <label className="label">Name</label>
                        <div className="controls">
                            <input type="text" className="input" placeholder="Name"
                                value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className="label">Email</label>
                        <div className="controls">
                            <input type="text" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className="label">Password</label>
                        <div className="controls">
                            <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <label className="label">Confirm Password</label>
                        <div className="controls">
                            <input type="password" className="input" placeholder="******" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button className="button is-success is-fullwidth">Register</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
 
export default Register