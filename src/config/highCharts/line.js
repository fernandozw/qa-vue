export function line(title, text) {
  let lineObject = {
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'gray'
      }
    },
    chart: {
      backgroundColor: '#fef0f0'
    },
    // 图表主标题
    title: {
      text: title
    },
    // x轴相关信息
    xAxis: {
      // x轴数据
      categories: []
    },
    // 饼图标题存放在labels中
    labels: {},
    // y轴相关信息
    yAxis: {
      // y轴标题
      title: {
        text: text
      }
    },
    // 实际数据
    series: [],
    tooltip: {
      // 标示区后缀
      valueSuffix: '',
      shared: true,
      formatter: null,
      crosshairs: {
        width: 1,
        color: 'gray'
      }
    }
  };
  return lineObject;
}

export function lineLabel(title, left, top) {
  let labelObject = {
    items: [
      {
        html: title,
        style: { fontSize: 20, color: 'blue', left: left, top: top }
      }
    ]
  };

  return labelObject;
}
