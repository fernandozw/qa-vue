// 单一饼图
export function pie(title, data) {
  let pieObj = {
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'gray'
      }
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: title
    },
    tooltip: {
      pointFormat:
        '数量: <b>{point.y}</b><br/>{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          // 是否展示标示线
          enabled: true
        },
        // 是否在图表下方展示标签说明
        showInLegend: true
      }
    },
    series: data
  };
  return pieObj;
}

// 折线图与饼图组合
export function innerPie() {
  let pieObject = {
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: 'gray'
      }
    },
    type: 'pie',
    name: '占比',
    data: [],
    center: [100, 30],
    size: 100,
    showInLegend: false,
    tooltip: {
      pointFormat:
        '数量: <b>{point.y}</b><br/>{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    dataLabels: {
      enabled: false
    }
  };
  return pieObject;
}
