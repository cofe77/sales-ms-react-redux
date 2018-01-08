import React, { Component } from 'react';
import {connect} from 'react-redux';
import {fetchGoodsDataById,hideGoodsDetailModal} from '../../../redux/goods.redux';
import {Modal,Row,Col } from 'antd';
import './GoodsDetail.css';

@connect(
    state=>state.goods,
    {fetchGoodsDataById,hideGoodsDetailModal}
)
class GoodsDetail extends Component {
  _handleCancel = () => {
    this.props.hideGoodsDetailModal();
  };
  componentDidMount() {
    this.props.fetchGoodsDataById(this.props.activeGoodsId)
  }

  render() {
    const goodsData = this.props.activeGoodsData
    return (
      <Modal
          title="商品详情"
          visible={this.props.goodsDetailModalVisible}
          onCancel={this._handleCancel.bind(this)}
          footer={null}
      >
        {this.props.activeGoodsId!==''?(
          <Row className="goods-detail-box">
            <Col span={12}>
              <img className="goods-detail-image" src={"/"+goodsData.photoUrl} alt="商品图片"/>
            </Col>
            <Col span={12}>
              商品名称：<p>{goodsData.name}</p>
              价格：<p>{goodsData.price}</p>
              类型：<p>{goodsData.typeName}</p>
              简介：<p>{goodsData.describe}</p>
            </Col>
          </Row>
        ):null}
      </Modal>
    );
  }
}

export default GoodsDetail
