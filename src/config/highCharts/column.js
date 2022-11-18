export function column(title, text) {
  let columnObject = {
    chart: {
      type: 'column',
      backgroundColor: '#fef0f0'
    },
    title: {
      text: title
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      min: 0,
      title: {
        text: text
      },
      // 堆叠数据标签
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        }
      }
    },
    tooltip: {
      formatter: function() {
        return (
          '<b>' +
          this.x +
          '</b><br/>' +
          this.series.name +
          ': ' +
          this.y +
          '<br/>' +
          '合计: ' +
          this.point.stackTotal
        );
      }
    },
    plotOptions: {
      column: {
        // 最下方显示标签
        showInLegend: true,
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
            textOutline: 'none'
          }
        }
      }
    },
    series: []
  };
  return columnObject;
}
