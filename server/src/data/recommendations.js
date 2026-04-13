/**
 * 精选推荐菜品库
 * image 字段当前使用 picsum.photos 占位图，生产环境请替换为实际 CDN 图片地址
 * 格式：https://picsum.photos/seed/{id}/600/400
 */
const RECOMMENDATIONS = [
  {
    id: 'hong-shao-rou',
    name: '红烧肉',
    image: 'https://picsum.photos/seed/hongshaorou/600/400',
    difficulty: '中等',
    duration: '60 分钟',
    description: '皮糯肉烂，肥而不腻，经典家常硬菜'
  },
  {
    id: 'gong-bao-ji-ding',
    name: '宫保鸡丁',
    image: 'https://picsum.photos/seed/gongbao/600/400',
    difficulty: '简单',
    duration: '25 分钟',
    description: '鸡肉鲜嫩，花生酥脆，微辣回甜'
  },
  {
    id: 'ma-po-dou-fu',
    name: '麻婆豆腐',
    image: 'https://picsum.photos/seed/mapo/600/400',
    difficulty: '简单',
    duration: '20 分钟',
    description: '麻辣鲜香，豆腐嫩滑，下饭神器'
  },
  {
    id: 'yu-xiang-rou-si',
    name: '鱼香肉丝',
    image: 'https://picsum.photos/seed/yuxiang/600/400',
    difficulty: '中等',
    duration: '30 分钟',
    description: '酸甜咸辣四味融合，川菜经典'
  },
  {
    id: 'qing-zheng-lu-yu',
    name: '清蒸鲈鱼',
    image: 'https://picsum.photos/seed/luyu/600/400',
    difficulty: '简单',
    duration: '25 分钟',
    description: '原汁原味，鱼肉鲜嫩，清淡养生'
  },
  {
    id: 'hui-guo-rou',
    name: '回锅肉',
    image: 'https://picsum.photos/seed/huiguorou/600/400',
    difficulty: '中等',
    duration: '35 分钟',
    description: '香辣浓郁，肥而不腻，川菜代表'
  },
  {
    id: 'san-bei-ji',
    name: '三杯鸡',
    image: 'https://picsum.photos/seed/sanbeiji/600/400',
    difficulty: '简单',
    duration: '30 分钟',
    description: '台式家常菜，酱香浓郁，九层塔提香'
  },
  {
    id: 'dong-po-rou',
    name: '东坡肉',
    image: 'https://picsum.photos/seed/dongporou/600/400',
    difficulty: '较难',
    duration: '90 分钟',
    description: '方正红亮，入口即化，苏东坡名作'
  },
  {
    id: 'bai-qie-ji',
    name: '白切鸡',
    image: 'https://picsum.photos/seed/baiqieji/600/400',
    difficulty: '简单',
    duration: '40 分钟',
    description: '皮脆肉嫩，原味鲜美，粤菜经典'
  },
  {
    id: 'fu-qi-fei-pian',
    name: '夫妻肺片',
    image: 'https://picsum.photos/seed/fuqifei/600/400',
    difficulty: '中等',
    duration: '45 分钟',
    description: '麻辣爽口，牛肉熟牛杂合璧，成都名小吃'
  },
  {
    id: 'gan-bian-si-ji-dou',
    name: '干煸四季豆',
    image: 'https://picsum.photos/seed/sijidou/600/400',
    difficulty: '简单',
    duration: '15 分钟',
    description: '外皮微皱，内里鲜嫩，香辣开胃'
  },
  {
    id: 'xi-hu-cu-yu',
    name: '西湖醋鱼',
    image: 'https://picsum.photos/seed/chuyu/600/400',
    difficulty: '中等',
    duration: '30 分钟',
    description: '酸甜适口，杭帮名菜，鱼肉鲜嫩'
  },
  {
    id: 'xiao-ji-dun-mo-gu',
    name: '小鸡炖蘑菇',
    image: 'https://picsum.photos/seed/jidunmogu/600/400',
    difficulty: '简单',
    duration: '50 分钟',
    description: '东北家常炖菜，鸡肉软烂，汤鲜味美'
  },
  {
    id: 'tu-dou-si',
    name: '炒土豆丝',
    image: 'https://picsum.photos/seed/tudousi/600/400',
    difficulty: '简单',
    duration: '15 分钟',
    description: '爽脆可口，百搭家常，三分钟学会'
  },
  {
    id: 'suan-rong-xi-lan-hua',
    name: '蒜蓉西兰花',
    image: 'https://picsum.photos/seed/xilianhua/600/400',
    difficulty: '简单',
    duration: '10 分钟',
    description: '翠绿爽脆，蒜香扑鼻，健康家常'
  },
  {
    id: 'kou-shui-ji',
    name: '口水鸡',
    image: 'https://picsum.photos/seed/koushui/600/400',
    difficulty: '中等',
    duration: '40 分钟',
    description: '麻辣鲜香，红油浓郁，川菜凉菜经典'
  },
  {
    id: 'cha-shao-rou',
    name: '叉烧肉',
    image: 'https://picsum.photos/seed/chasharou/600/400',
    difficulty: '中等',
    duration: '60 分钟',
    description: '蜜汁焦香，粤式烧腊，甜咸平衡'
  },
  {
    id: 'di-san-xian',
    name: '地三鲜',
    image: 'https://picsum.photos/seed/disanxian/600/400',
    difficulty: '简单',
    duration: '20 分钟',
    description: '茄子土豆青椒同炒，东北下饭菜王'
  },
  {
    id: 'hong-shao-qie-zi',
    name: '红烧茄子',
    image: 'https://picsum.photos/seed/qiezi/600/400',
    difficulty: '简单',
    duration: '20 分钟',
    description: '软糯入味，酱香浓郁，素菜不素'
  },
  {
    id: 'yang-zhou-chao-fan',
    name: '扬州炒饭',
    image: 'https://picsum.photos/seed/chaofan/600/400',
    difficulty: '简单',
    duration: '15 分钟',
    description: '粒粒分明，蛋香浓郁，剩饭的最高归宿'
  }
];

module.exports = RECOMMENDATIONS;
