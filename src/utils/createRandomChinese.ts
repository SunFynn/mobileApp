/* 方法一 */
// 获取指定范围内的随机数
function randomNum(min,max){
  return Math.floor(Math.random() * (min - max) + max)
}

// 解码Unicode
function solveUnicode(str) {
    //Unicode显示方式是\u4e00
    str = "\\u"+str
    str = str.replace(/\\/g, "%");
    //转换中文
    str = unescape(str);
    //将其他受影响的转换回原来
    str = str.replace(/%/g, "\\");
    return str;
}

//生成随机汉字包括生僻字
export function randomString(length){
  let name = ""
  for(let i = 0;i<length;i++){
    let unicodeNum  = ""
    unicodeNum = randomNum(0x4e00,0x9fa5).toString(16)
    name += solveUnicode(unicodeNum)
  }
  return name
}


/* 方法2 */
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
