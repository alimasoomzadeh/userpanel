import React, {useState, useContext} from 'react';
import 'antd/dist/antd.css';

import {Layout, Input, Button, Col, Row} from 'antd';
import {AppContext} from './AppContext';
import HeaderSegment from "./segment/HeaderSegment";


export default function Home() {

    const context = useContext(AppContext);
    const {Content} = Layout;
    const [username, setUsername] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [viewCode, setViewCode] = useState(false);
    const [confirmationCodeObj, setConfirmationCodeObj] = useState({});
    const [confirmationCode, setConfirmationCode] = useState("");
    const [codeError, setCodeError] = useState('');

    // بررسی تغییرات فیلد موبایل
    const onChangeMobile = (e) => {
        let valueInput = e.target.value;
        if (valueInput.length == 11) {
            const valid = validationMobile(valueInput);
            if (valid) {
                setUsername(valueInput);
                setMobileError("");
            } else {
                setMobileError("Mobile is not valid");
            }
        } else {
            setMobileError("The input length should be 11");
        }

    };
    // بررسی خطا های فیلد موبایل
    function validationMobile(valueInput) {
        let mobileno = /^(\98|0)?9\d{9}$/;
        if (mobileno.test(valueInput)) {
            return true;
        } else {
            return false;
        }
    }
    // کلید تایید فرم موبایل
    const submitMobile = () => {
        if (username !== "") {
            if (username.length == 11) {
                const valid = validationMobile(username);
                if (valid) {
                    setViewCode(true);
                    setMobileError("");
                } else {
                    setMobileError("Mobile is not valid");
                }
            } else {
                setMobileError("The input length should be 11");
            }
        } else {
            setMobileError("This field is required");
        }
    };

   // بررسی تغییرات فیلد کد تایید (otp)
    const onChangeCode = (e) => {
        let inputId = e.target.id;
        let value = e.target.value;
        if (value !== undefined && value !== "") {
            confirmationCodeObj[inputId] = value;
        } else {
            delete confirmationCodeObj[`${inputId}`];
        }
        if (Object.keys(confirmationCodeObj).length === 4) {
            setConfirmationCode(confirmationCodeObj[0] + confirmationCodeObj[1] + confirmationCodeObj[2] + confirmationCodeObj[3])
        }
    };

    // کلید تایید کد تایید (otp)
    const submitCode = () => {
        if (Object.keys(confirmationCodeObj).length === 4) {
            const loginResult = context.loggedInModel.login(username, confirmationCode);
            if (loginResult) {
                window.location.hash = "#/userpanel"
            }
        } else {
            setCodeError("All fields are required");
        }
    };

    // بررسی لاگین بودن کاربر
    if (!context.loggedInModel.loginUser) {
        // بررسی نمایش فرم کد تایید (otp)
        if (viewCode === false) {
            return (
                <Layout className="layout LayoutPage">
                    <HeaderSegment>
                    </HeaderSegment>
                    <Content style={{padding: '0 50px'}}>
                        <Col span={12} offset={6} className="boxForm">
                            <Row>
                                <Col span={12} offset={6}>
                                    <h1>Log in</h1>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12} offset={6}>
                                    <Input placeholder="plese enter the mobile" onChange={onChangeMobile}/>
                                </Col>
                                <Col span={9} offset={5}>
                                    <span className="pmError">{mobileError}</span>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12} offset={6}>
                                    <Button type="primary" className="colorButton" size="Submit" onClick={submitMobile}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Content>
                </Layout>
            );
        } else {
            return (
                <Layout className="layout LayoutPage">
                    <HeaderSegment>
                    </HeaderSegment>
                    <Content style={{padding: '0 50px'}}>
                        <Col span={12} offset={6} className="boxForm">
                            <Row>
                                <Col span={12} offset={6}>
                                    <h1>Verification Code</h1>
                                    <p>{`plese enter the verification code sent to ${username}`}</p>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12} offset={8}>
                                    <Input.Group size="large">
                                        <Row gutter={[16, 16]}>
                                            <Col span={4}>
                                                <Input maxLength="1" id="input1" onChange={onChangeCode}/>
                                            </Col>
                                            <Col span={4}>
                                                <Input maxLength="1" id="input2" onChange={onChangeCode}/>
                                            </Col>
                                            <Col span={4}>
                                                <Input maxLength="1" id="input3" onChange={onChangeCode}/>
                                            </Col>
                                            <Col span={4}>
                                                <Input maxLength="1" id="input4" onChange={onChangeCode}/>
                                            </Col>
                                        </Row>
                                    </Input.Group>

                                </Col>
                                <Col span={9} offset={6}>
                                    <span className="pmError">{codeError}</span>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12} offset={6}>
                                    <Button type="primary" className="colorButton" size="Submit" onClick={submitCode}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Content>
                </Layout>
            );
        }
    } else {
        window.location.hash = "#/userpanel";
        return true;
    }
}


