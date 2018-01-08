import React, { Component } from 'react';
import { Button,Table,Modal,Input, Icon } from 'antd';
import {fetchGoodsData,fetchGoodsTypeData,showGoodsDetailModal,showUpdateGoodsModal,deleteGoods} from '../../../redux/goods.redux'
import { connect } from "react-redux";
import './GoodsLists.css';

import GoodsDetail from '../../../containers/Goods/GoodsDetail/GoodsDetail';
import GoodsUpdate from '../../../containers/Goods/GoodsUpdate/GoodsUpdate';

const confirm = Modal.confirm;

@connect(
    state=>state.goods,
    {fetchGoodsData,fetchGoodsTypeData,showGoodsDetailModal,showUpdateGoodsModal,deleteGoods}
)
class GoodsLists extends Component {

  constructor(props){
    super(props)
    this._handleDeleteGoods=this._handleDeleteGoods.bind(this)
    this.state={
      dataSource:[],
      loading: true,
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      pagination:'',
    }
  }
  _onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.props.fetchGoodsData({
      ...filters,
    });
  }
  componentDidMount() {
    if(this.props.goodsCount<=0){
      this.props.fetchGoodsTypeData();
      this.props.fetchGoodsData();
    }
  }

  _onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    const goodsData=this.props.goodsData;
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      dataSource: goodsData.map((record) => {
        const match = record.name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          name: (
            <span>
            {record.name.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight" key={i}>{match[0]}</span>, text] : text
            ))}
            </span>
          ),
        };
      }).filter(record => !!record),
      pagination:this.state.dataSource.length
    });
  }
  _handleDeleteGoods=(goods)=>{
    const {id,name}=goods
    const {deleteGoods} = this.props
    confirm({
      title: '确认删除：“'+name+'”？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        deleteGoods(id)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  render() {
    const columns = [{
      title: '商品名称',
      dataIndex: 'name',
      width: '20%',
      filterDropdown: (
        <div className="custom-filter-dropdown">
          <Input
              ref={ele => this.searchInput = ele}
              placeholder="商品名称"
              value={this.state.searchText}
              onChange={this._onInputChange}
              onPressEnter={this._onSearch}
          />
          <Button type="primary" onClick={this._onSearch}>搜索</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput.focus());
      },
    }, {
      title: '价格',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      width: '20%',
    },{
      title: '类别',
      dataIndex: 'typeName',
      filters: this.props.goodsTypeData.map(v=>({text:v.name,value:v.name})),
      filterMultiple: false,
      width: '20%',
    }, {
      title: '操作',
      render: (text, record) => (
        <div>
          <Button type="primary" size="small" onClick={()=>this.props.showGoodsDetailModal(record.id)}>详情</Button>
          <Button type="primary" size="small" onClick={()=>this.props.showUpdateGoodsModal(record.id)}>修改信息</Button>
          <Button type="danger" size="small" onClick={()=>this._handleDeleteGoods(record)}>删除</Button>
        </div>
      ),
    }];
    const dataSource=this.state.filtered?this.state.dataSource:this.props.goodsData
    const pagination=this.state.filtered?this.state.pagination:this.props.goodsCount
    const loading=!this.props.goodsCount>0

    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        <Button type="primary" size="large" onClick={()=>this.props.showUpdateGoodsModal(0)}>添加商品</Button>
        <Button type="primary" size="large" onClick={()=>this.props.showUpdateGoodsModal(0)}>商品类别管理</Button>
        <Table columns={columns}
               rowKey={record => record.id}
               dataSource={dataSource}
               pagination={pagination}
               loading={loading}
               onChange={this.handleTableChange}
        />
        {!this.props.goodsDetailModalVisible?null:<GoodsDetail />}
        {!this.props.goodsUpdateModalVisible?null:<GoodsUpdate />}
      </div>
    );
  }
}

export default GoodsLists
