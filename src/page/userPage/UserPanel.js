import React, {useState, useEffect, useRef, useContext} from 'react';
import 'antd/dist/antd.css';

import {Layout, Breadcrumb, Table, Input, Popconfirm, Form, Space, Button, Menu} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import {AppContext} from '../AppContext';
import HeaderSegment from "../segment/HeaderSegment";

const {Sider, Content} = Layout;
const {SubMenu} = Menu;

// فرم ویرایش سطرها
const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const UserPanel = (props) => {
    const context = useContext(AppContext);
    const state = {
        searchText: '',
        searchedColumn: '',
        error: null,
        data: []
    };

    const [stateTable, setStateTable] = useState(state);
    const searchInput = useRef(null);

    // درخواست اطلاعات از سمت سرور
    useEffect(() => {
        fetch("https://jsonplaceholder.ir/users")
            .then(res => res.json())
            .then(
                (result) => {
                    result.map(index => {
                        index["key"] = index.id;
                    });
                    setStateTable({
                        ...stateTable,
                        data: result
                    })
                },
                (error) => {
                    setStateTable({
                        ...stateTable,
                        error: error
                    })
                }
            )
    }, []);


    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    // کلید ویرایش اطلاعات سطر جدول
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
            username: record.username,
        });
        setEditingKey(record.key);
    };
    // کلید انصراف ویرایش اطلاعات
    const cancel = () => {
        setEditingKey('');
    };
    // کلید تایید ویرایش اطلاعات
    const save = async (key) => {
        try {
            const rowData = await form.validateFields();
            fetch("https://jsonplaceholder.ir/users/" + key + "/", {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(rowData)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        setEditingKey('');
                    },
                    (error) => {
                    }
                )
        } catch (errInfo) {
        }

    };

    // کلید جستجو از جدول
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: text =>
            stateTable.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[stateTable.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // کلید تایید جستجو از جدول
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setStateTable({
            ...stateTable,
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });

    };

    // کلید ریست جستجو
    const handleReset = clearFilters => {
        clearFilters();
        setStateTable({
            ...stateTable,
            searchText: ''
        });
    };

     // عناوین جدول
    const columns = [
        {
            title: 'username',
            dataIndex: 'username',
            width: '20%',
            editable: true,
            sorter: (a, b) => a.username.length - b.username.length,
            ...getColumnSearchProps('username'),
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '20%',
            editable: true,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'email',
            dataIndex: 'email',
            width: '30%',
            editable: true,
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'phone',
            dataIndex: 'phone',
            width: '30%',
            editable: true,
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <a
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </a>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    // بررسی لاگین بودن کاربر
    if (context.loggedInModel.loginUser) {
        return (
            <Layout className="layout LayoutPage">
                <HeaderSegment>
                </HeaderSegment>
                <Content style={{padding: '0 50px'}}>
                    <Breadcrumb className="breadcrumbStyle">
                        <Breadcrumb.Item>User Panel</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className="site-layout-background boxUserPanelForm">
                        <Sider className="site-layout-background" width={200} >
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                className="boxMenu"
                            >
                                <Menu.Item key="1">Users List</Menu.Item>

                            </Menu>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <Form form={form} component={false}>
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    bordered
                                    dataSource={stateTable.data}
                                    columns={mergedColumns}
                                    rowClassName="editable-row"
                                    pagination={{
                                        onChange: cancel,
                                    }}
                                />
                            </Form>

                        </Content>
                    </Layout>
                </Content>

            </Layout>
        );
    } else {
        window.location.hash = "#/"
        return true;
    }
};


export default UserPanel;


