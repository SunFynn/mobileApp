import React, { Component, PropsWithChildren } from "react";
import { redirectTo } from "@tarojs/taro";
import { AtTabBar } from "taro-ui";
import styles from "./app.module.less";
import 'taro-ui/dist/style/index.scss';

class App extends Component<PropsWithChildren, any> {       
  constructor(props){
    super(props);
    this.state={
      current: 2,
      navList: [
        {title: "grid", url: "pages/index/index"}, 
        {title: '照相'},
        {title: "IntersectionObserver", url: 'pages/intersectionObserver/index'}
      ]
    }
  }
 
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleTabChange(value){
    const { navList } = this.state;
    this.setState({
      current: value
    });
    redirectTo({url: navList[value].url})
  }

  render() {
    // this.props.children 是将要会渲染的页面
    return (
      <div className={styles.appBox}>
        <div className={styles.childrenBox}>{this.props.children}</div>
        <div className={styles.bottomNavBox}>
          {/* <div className={styles.bottomGrid}>
            {this.state.navList.map((item, idx) => {
              return <div key={idx} onClick={()=>{ redirectTo({url: item.url})}}>{item.title}</div>;
            })}
          </div> */}
          <AtTabBar
            tabList={[
              { title: 'grid', iconType: 'bullet-list', text: 'new' },
              { title: '拍照', iconType: 'camera' },
              { title: 'IntersectionObserver', iconType: 'folder', text: '100', max: 99 }
            ]}
            onClick={this.handleTabChange.bind(this)}
            current={this.state.current}
          />
        </div>
      </div>
    );
  }
}

export default App;
