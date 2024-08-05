import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

export function TimelineChart({ height=350, series, children }) {
  const chartConfig = {
    type: 'line',
    stacked: false,
    height: height,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'pan'
    },
    series: series,
    options: {
      chart: {
        id: "snapshotsTimelineChart"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      dataLabels: {
        enabled: false,
      },
      // fill: {
      //   type: 'gradient',
      //   gradient: {
      //     shadeIntensity: 1,
      //     inverseColors: false,
      //     opacityFrom: 0.5,
      //     opacityTo: 0,
      //     stops: [0, 90, 100]
      //   },
      // },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
          formatter: function (val) {
            return (val).toFixed(4)+'%'
          },
        },
      },
      xaxis: {
        type: 'datetime',
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        tooltip: {
          style: {
            fontSize: "14px",
            fontFamily: "inherit",
          }
        }
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      tooltip: {
        shared: true,
        custom: children?.tooltip ?? undefined,
        y: {
          formatter: function (val) {
            return (val).toFixed(4)+'%'
          },
        }
      }
    },
  };
  
  return (
    <Chart {...chartConfig} />
  )
}