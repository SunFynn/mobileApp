import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, ScrollView } from "@tarojs/components";
import styles from "./index.module.less";

function Index() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleSearchText();
  }, []);

  // 判断图片的加载情况
  function loadImagesFunc(imgs: any[]): Promise<any> {
    const urlArrsPromise = [...imgs].map((image) => {
      return new Promise((resolve, reject) => {
        image.onload = function () {
          resolve("image unloded");
        };
        image.onerror = function () {
          reject("image unloded error");
        };
        if (image.complete) {
          resolve("image has loded");
        }
      });
    });
    return Promise.allSettled(urlArrsPromise)
      .then((res) => res)
      .catch((err) => console.log(err));
  }

  useLayoutEffect(() => {
    const allBox: any = document.getElementById("allBox");
    const cardBoxDivLis = document.getElementsByClassName("cardBoxDivLi");
    const cardBoxDivs = document.getElementsByClassName("cardBoxDiv");
    // @ts-ignore
    const imgs: any[] = allBox?.querySelectorAll("img") || [];
    loadImagesFunc(Array.from(imgs)).then(() => {
      // 不是真正的数组，不能使用map、forEach等便利方式
      for (let i = 0; i < cardBoxDivs.length; i++) {
        const h = (cardBoxDivs[i] as HTMLElement).offsetHeight;
        // 注意：需要给map中的元素定义两层元素，给外侧的元素定义里侧元素的真实高度，不然展示会有问题*******
        if (cardBoxDivLis[i]) {
          //@ts-ignore
          cardBoxDivLis[i].style.gridRowEnd = `span ${h * 2 + 30}`;
        }
      }
    });
  }, [list]);

  // 随机生成数字
  function random(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // 随机生成文字
  const createRandomChinese = (count: number) => {
    const start = parseInt("4e00", 16);
    const end = parseInt("9fa5", 16);
    let name = "";
    for (let i = 0; i < count; i++) {
      const cha = Math.floor(Math.random() * (end - start));
      name += "\\u" + (start + cha).toString(16);
    }
    return eval(`'${name}'`);
  };

  const handleSearchText = async () => {
    fetch(
      "https://mock.mengxuegu.com/mock/63899dbd93a67b5f1066906f/api/pinterest",
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const { data } = res;
        setLoading(false);
        const arr: any[] = [];
        data.forEach((item: any, i: number) => {
          const obj: any = {};
          // obj.img = `https://picsum.photos/640/200/?random=${random(1, 1000)}`;
          obj.img = `${item.img}`;
          obj.title = `${list.length + i + 1}`;
          obj.desction = `${createRandomChinese(random(10, 100))}`;
          arr.push(obj);
        });
        setList((prev) => [...prev, ...arr]);
      });
  };

  const handleScroll = () => {
    const allBox: any = document.getElementById("allBox");

    // box.scrollHeight  滚动条高度
    // box.clientHeight  视图区域高度
    // box.scrollTop     滚动条距离最上边高度
    if (allBox.scrollHeight - allBox.clientHeight > allBox.scrollTop) {
      // 未到底
      console.log(1);
    } else {
      // 已到底部
      console.log(2);
      setLoading(true);
      setTimeout(() => {
        handleSearchText();
      }, 1000);
    }
  };

  return (
    <View className={styles.IndexPage}>
      <ScrollView
        className={styles.GridBox}
        id='allBox'
        scrollY
        scrollWithAnimation
        scrollTop={0}
        lowerThreshold={20}
        upperThreshold={50}
        // onScrollToLower={this.onScrollToLower}
        onScroll={handleScroll}
      >
        {list.map((item) => {
          return (
            <div key={item.title} className={`${styles.cardBox} cardBoxDivLi`}>
              <div className='cardBoxDiv'>
                <img
                  src={item.img}
                  alt='图片丢失'
                  width='100%'
                  height='100px'
                />
                <div>{item.title}</div>
                <p>{item.desction}</p>
              </div>
            </div>
          );
        })}
        {loading && <div className={styles.loading}>loading...</div>}
      </ScrollView>
    </View>
  );
}

export default Index;
