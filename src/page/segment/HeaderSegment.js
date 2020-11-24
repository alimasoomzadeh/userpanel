import React, {useContext} from "react";
import {Layout, Col, Row} from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import {AppContext} from '../AppContext';

const HeaderSegment = (props) => {
    const context = useContext(AppContext);
    const {Header} = Layout;

    const logout = ()=>{
        context.loggedInModel.logout()
    };



    if (context.loggedInModel.loginUser) {
        return (
            <Header className="headerPage">
                <Row gutter={[1, 1]}>
                    <Col span={2}>
                        <h1>Username:</h1>
                    </Col>
                    <Col span={3}>
                        <h1>{context.loggedInModel.username}</h1>
                    </Col>
                    <Col span={4}>
                        <LogoutOutlined className="iconLogout" onClick={logout}/>
                    </Col>
                </Row>
            </Header>
        )
    } else {
        return (
            <Header className="headerPage">
                <Row gutter={[1, 1]}>
                </Row>
            </Header>
        )
    }
};

export default HeaderSegment;