import React, { Component, PropsWithChildren } from "react";
import { redirectTo } from "@tarojs/taro";
import styles from "./app.module.less";

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const navList = [
      {title: "grid", url: "pages/index/index"}, 
      {title: "IntersectionObserver", url: 'pages/intersectionObserver/index'}
    ];
    // this.props.children 是将要会渲染的页面
    return (
      <div className={styles.appBox}>
        <div className={styles.childrenBox}>{this.props.children}</div>
        <div className={styles.bottomNavBox}>
          <div className={styles.bottomGrid}>
            {navList.map((item, idx) => {
              return <div key={idx} onClick={()=>{ redirectTo({url: item.url})}}>{item.title}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
