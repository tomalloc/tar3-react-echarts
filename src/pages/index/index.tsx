import React , { Component }from 'react';
import { View } from '@tarojs/components';
import EChart from '@/components/echarts';

import * as echarts from './echarts.js';

import './index.scss';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {
        title: {
          show: false,
          // text: '测试下面legend的红色区域不应被裁剪',
          // left: 'center'
        },
        color: ['#1890ff'],
        legend: {
          show: false,
          // data: ['A', 'B', 'C'],
          // top: 50,
          // left: 'center',
          // backgroundColor: 'red',
          // z: 100
        },
        grid: {
          // show: true,
          containLabel: true,
          top: 10,
          left: 2,
          right: 25,
          bottom: 10,
          // borderColor: '#ff0000'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{c}',
          backgroundColor: '#1890ff',
          position: function(point, params, dom, rect, size) {
            return [point[0], '10%'];
          },
          axisPointer: {
            lineStyle: {
              color: '#D2CCCC',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#5E5E5E',
          },
          // data: xData,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          // show: false
        },
        yAxis: {
          x: 'center',
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#5E5E5E',
          },
          splitLine: {
            lineStyle: {
              color: '#C2C0C0',
              type: 'dashed',
            },
          },
          // show: false
        },
        series: [
          {
            name: 'A',
            type: 'line',
            smooth: true,
            // data: yData,
            data: [1800, 360, 65, 30, 780, 40, 33]
          } /*, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }*/,
        ],
      },
      exportedImg: '',
    };

  }

  componentDidMount() {

    this.pieChart.init((canvas, width, height, canvasDpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: canvasDpr,
      });
      canvas.setChart(chart);
      const pieOption = {
        title: {
          text: "某站点用户访问来源",
          subtext: "纯属虚构",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      chart.setOption(pieOption);
      return chart;

    });

  }

  refPieChart = (node) => (this.pieChart = node);

  pieChart: any;

  render() {
    const { option, exportedImg } = this.state;
    const barOption = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(220, 220, 220, 0.8)",
          },
        },
      ],
    };



    return (
      <View className="page-index">
        <View className="chart">
          <EChart canvasId="line-canvas" echarts={echarts} option={option} />
        </View>
        <View className="chart">
          <EChart canvasId="bar-canvas" echarts={echarts} option={barOption}  />
        </View>
        <View className="chart">
          <EChart canvasId="pie-canvas" echarts={echarts} ref={this.refPieChart}  />
        </View>
      </View>
    );
  }

}

