import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import { Layout } from 'antd';
import AuthorizedRoute from '../../components/AuthorizedRoute';

import GoodsLists from '../../containers/Goods/GoodsLists/GoodsLists';
import OperatorLists from '../../containers/Operator/OperatorLists/OperatorLists';
import Welcome from '../../components/Welcome';

const { Content } = Layout;

class ContentRoutes extends Component {

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Route exact path="/" component={Welcome} />
        <AuthorizedRoute path="/goodsManage" component={GoodsLists} />
        <AuthorizedRoute path="/operatorManage" component={OperatorLists} />
      </Content>
    );
  }
}

export default ContentRoutes;