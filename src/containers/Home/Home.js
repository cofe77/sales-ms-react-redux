import React, { Component } from 'react';
import {Link,Switch,withRouter,Route} from 'react-router-dom';
import './Home.css';
import { Layout, Menu, Modal, Icon } from 'antd';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import {connect} from 'react-redux'
import {fetchGoodsData,fetchGoodsTypeData} from '../../redux/goods.redux'

import ContentRoutes from '../../containers/ContentRoutes/ContentRoutes';
import GoodsLists from '../../containers/Goods/GoodsLists/GoodsLists';
import OperatorLists from '../../containers/Operator/OperatorLists/OperatorLists';
import OperatorUpdate from '../../containers/Operator/OperatorUpdate/OperatorUpdate';
import UsedOrder from '../../containers/Statistics/UsedOrder/UsedOrder';
import TurnOver from '../../containers/Statistics/TurnOver/TurnOver';
import SavedBeer from '../../containers/Statistics/SavedBeer/SavedBeer';
import Welcome from '../../components/Welcome';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const confirm = Modal.confirm;

@connect(
    null,
    {fetchGoodsData,fetchGoodsTypeData}
)
class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      collapsed: false,
      selectedKey:[],
      openKey:[]
    }
    this._onOpenChange=this._onOpenChange.bind(this)
    this._handleClick=this._handleClick.bind(this)
    this._onCollapse=this._onCollapse.bind(this)
  }

  _onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  componentWillMount(){
    if(this.props.goodsCount<=0){
      this.props.fetchGoodsTypeData();
      this.props.fetchGoodsData();
    }
  }

  componentDidMount(){
    const {pathname} = this.props.location
    if(pathname.split('/').indexOf('goodsManage')>-1){
      this.setState({
        selectedKey: ['1']
      })
    }else if(pathname.split('/').indexOf('operatorManage')>-1){
      this.setState({
        selectedKey: ['2']
      })
    }else if(pathname.split('/').indexOf('usedOrder')>-1){
      this.setState({
        selectedKey: ['3']
      })
    }else if(pathname.split('/').indexOf('turnOver')>-1){
      this.setState({
        selectedKey: ['4']
      })
    }
  }

  _handleClick=(event)=>{
    switch (event.key){
      case '1':
        this.setState({
          selectedKey:['1'],
          openKey: [],
        })
        this.props.history.push('/home/goodsManage')
        break;
      case '2':
        this.setState({
          selectedKey:['2'],
          openKey: [],
        })
        this.props.history.push('/home/operatorManage')
        break;
      case '3':
        this.setState({
          selectedKey:['3'],
            openKey: ['sub1'],
        })
        this.props.history.push('/home/statistics/usedOrder')
        break;
      case '4':
        this.setState({
          selectedKey:['4'],
          openKey: ['sub1'],
        })
        this.props.history.push('/home/statistics/turnOver')
        break;
      case '9':
        confirm({
          title: '确认注销并退出？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            console.log('OK');
            this.props.history.push('/login')
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
    }
  }

  _onOpenChange=(openKeys)=>{
    console.log(openKeys)
    this.setState({
      openKey: openKeys
    })
  }

  render() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this._onCollapse}
          >
            <div className="logo" />
            <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                onClick={this._handleClick}
                selectedKeys={this.state.selectedKey}
                openKeys={this.state.openKey}
                onOpenChange={this._onOpenChange}
            >
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>商品管理</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>操作员管理</span>
              </Menu.Item>
              <SubMenu
                  key="sub1"
                  title={<span><Icon type="user" /><span>统计</span></span>}
              >
                <Menu.Item key="3">消费单统计</Menu.Item>
                <Menu.Item key="4">营业额统计</Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
                <Icon type="file" />
                <span>退出</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#001529', padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
              <Switch>
                <AuthorizedRoute exact path="/home/welcome" component={Welcome} />
                <AuthorizedRoute exact path="/home/goodsManage" component={GoodsLists} />
                <AuthorizedRoute exact path="/home/operatorManage" component={OperatorLists} />
                <AuthorizedRoute exact path="/home/operatorManage/operatorUpdate" component={OperatorUpdate} />
                <AuthorizedRoute exact path="/home/statistics/usedOrder" component={UsedOrder} />
                <AuthorizedRoute exact path="/home/statistics/turnOver" component={TurnOver} />
                <AuthorizedRoute component={Welcome} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
    );
  }
}

export default withRouter(Home);
