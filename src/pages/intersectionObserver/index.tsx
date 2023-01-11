import React, {
  useEffect,
  useReducer,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import styles from "./index.module.less";

interface WaterFallItem {
  img: string;
  title: string;
  desction: string;
}

const IntersectionObserverBox = () => {
  const columnCount = useMemo(() => 2, []); // 列数
  const [loading, setLoading] = useState<boolean>(false);
  const [initialize, setInitialize] = useState(true); // 是否属于初渲染阶段
  const [dataList, setDataList] = useState<WaterFallItem[]>([]);
  const [hasGet, setHasGet] = useState(false);
  const [allColumnData, setAllColumnData] = useState<WaterFallItem[][]>(
    Array.from(new Array(columnCount), () => [])
  );
  const [dataIndex, setDataIndex] = useState(columnCount);

  // 强制重新渲染页面使用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    handleSearchText();
  }, []);

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

  // 加载更多
  const handleSearchText = async () => {
    fetch(
      "https://mock.mengxuegu.com/mock/63899dbd93a67b5f1066906f/api/pinterest",
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        const { data } = res;
        const arr: any[] = [];
        data.forEach((item: any, i: number) => {
          const obj: any = {};
          // obj.img = `https://picsum.photos/640/200/?random=${random(1, 1000)}`;
          obj.img = `${item.img}`;
          obj.title = `${dataList.length + i + 1}`;
          obj.desction = `${createRandomChinese(random(10, 100))}`;
          arr.push(obj);
        });
        setDataList((prev) => [...prev, ...arr]);
        setHasGet((prevState) => !prevState);
      });
  };

  const initFirstRow = () => {
    // 初始化渲染指定列数元素内容，比如columnCount为2，则allColumnData的值为[Array(1), Array(1)]
    const curData = allColumnData;
    for (let i = 0; i < dataList.length && i < columnCount; i++) {
      curData[i].push(dataList[i]);
    }
    setAllColumnData(curData);
    setInitialize(false); // 初始化渲染阶段结束之后，控制不再进入此阶段，进入的是addPicture阶段
    // 此处需要执行强制刷新
    forceUpdate();
    setHasGet((prevState) => !prevState); // 初始化渲染结束后，进入addPicture阶段
  };

  useEffect(() => {
    // useEffect在页面初始化以及依赖项改变时执行，页面初始化时不需要追加图片
    if (dataList.length > 0 && initialize) {
      initFirstRow();
    }
  }, [dataList, initialize]);

  const startObserve = (index: number) => {
    const columnArray: any = document.querySelectorAll(".flex-column")[index].querySelectorAll(".flex-column-ele");
    // 瀑布流布局：取出数据源中最靠前的一个并添加到瀑布流高度最小的那一列，等图片完全加载后重复该循环
    const observerObj: any = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const { target, isIntersecting } = entry;
        if (isIntersecting) {
          observerObj.unobserve(target);
          setHasGet((prevState) => !prevState);
        }
      }
    });
    columnArray.length && observerObj.observe(columnArray[columnArray.length - 1]);
  };

  const addPicture = () => {
    if (dataIndex >= dataList.length) {
      // alert('图片已加载完成');
      return;
    }
    const columnArray: NodeListOf<HTMLElement> = document.querySelectorAll(".flex-column");
    const eleHeight: any = [];
    for (let i = 0; i < columnArray.length; i++) {
      eleHeight.push(columnArray[i].offsetHeight);
    }
    // 每次找出最小的
    const minEle = Math.min(...eleHeight);
    const index = eleHeight.indexOf(minEle);
    // 然后把下一个data元素添加在上面高度最矮的这一列里
    const curData = allColumnData;
    curData[index].push(dataList[dataIndex]);
    setDataIndex((n) => n + 1);
    setAllColumnData(curData);
    forceUpdate();
    startObserve(index);
  };

  useLayoutEffect(() => {
    if (dataList.length > 0 && !initialize) {
      // 跳过页面初始化
      addPicture();
    }
  }, [hasGet, initialize]);

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
    <div className={styles.IntersectionObserverPage}>
      <ScrollView
        className={`flex-row ${styles.flexBox}`}
        id='allBox'
        scrollY
        scrollWithAnimation
        scrollTop={0}
        lowerThreshold={20}
        upperThreshold={50}
        onScroll={handleScroll}
      >
        {allColumnData.map((item, index) => (
          <div
            className={`flex-column ${styles.flexItem}`}
            key={index}
            style={{ flex: 1 }}
          >
            {item.map((curItem) => (
              <div
                className={`flex-column-ele ${styles.cardBox}`}
                key={curItem.title}
              >
                <img src={curItem.img} />
                <div>{curItem.title}</div>
                <p>{curItem.desction}</p>
              </div>
            ))}
          </div>
        ))}
      </ScrollView>
      {loading && <div className={styles.loading}>loading...</div>}
    </div>
  );
};

export default IntersectionObserverBox;
