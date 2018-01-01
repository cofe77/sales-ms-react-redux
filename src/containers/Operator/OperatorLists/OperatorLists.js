import React, { Component } from 'react';
import { Button,Breadcrumb,Table,message } from 'antd';
import './OperatorLists.css';
import axios from 'axios';


class OperatorLists extends Component {

  state = {
    data: [],
    pagination: {},
    loading: false,
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchGoodsData({
      ...filters,
    });
  }
  fetchGoodsData = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    var reqData=params.permission?(params.permission[0]!=null?{
      row:10000,
      permission:params.permission[0]*1
    }:{
      row:10000
    }):{
      row:10000
    };
    axios.post('/operator/getByParams',reqData).then((response)=>{
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = response.data[0].count;
      this.setState({
        loading: false,
        data: response.data.slice(1),
        pagination,
      });
    }).catch((error)=>message.error('网络错误！'));
  };
  componentDidMount() {
    this.fetchGoodsData();
  }



  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
    }, {
      title: '手机号码',
      dataIndex: 'mobileNum',
      width: '20%',
    },{
      title: '类别',
      dataIndex: 'permission',
      filters: [{
        text: '普通操作员',
        value: 1,
      }, {
        text: '超级管理员',
        value: 2,
      }],
      filterMultiple: false,
      width: '20%',
    }, {
      title: '操作',
      render: (text, record) => (
          <div>
            <Button type="primary" size="small">详情</Button>
            <Button type="primary" size="small">修改</Button>
            <Button type="danger" size="small">删除</Button>
          </div>
      ),
    }];

    return (
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          <Table columns={columns}
                 rowKey={record => record.id}
                 dataSource={this.state.data}
                 pagination={this.state.pagination}
                 loading={this.state.loading}
                 onChange={this.handleTableChange}
          />
        </div>
    );
  }
}

export default OperatorLists;
