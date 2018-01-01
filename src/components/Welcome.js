import React, { Component } from 'react';
import { Button } from 'antd';
import '../style/Welcome.css';

class Welcome extends Component {
  render() {
    return (
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          欢迎来到SalesMS！
        </div>
    );
  }
}

export default Welcome;
