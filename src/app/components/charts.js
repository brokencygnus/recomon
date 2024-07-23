import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TimelineChart({ children }) {
  const chartConfig = {
    type: 'line',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'pan'
    },
    series: [{
      name: 'XYZ MOTORS',
      data: [{ x: '2024-06-01T00:00Z', y: 123 }, { x: '2024-06-02T00:00Z', y: 17 }, { x: '2024-06-05T00:00Z', y: 126 }]
    }],
    options: {
      chart: {
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
      title: {
        text: 'Stock Price Movement',
        align: 'left',
        style: {
          colors: "#616161",
          fontSize: "14px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
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
        formatter: function (val) {
          return (val / 1).toFixed(0);
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 400,
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
            return (val / 1).toFixed(0)
          },
        }
      }
    },
  };
  
  return (
    <Chart {...chartConfig} />
  )
}