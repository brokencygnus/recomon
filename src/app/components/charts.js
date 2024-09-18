import dynamic from "next/dynamic";
import { createContext, useContext, useState, useEffect } from "react";
import { Dropdown } from '@/app/components/dropdown';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ChartContext = createContext(null)

export function ChartProvider({ id, series, defaultZoomDays=30, showOnLoad, children }) {
  const initialState = [...series].reduce(
    function(obj, v) {
      obj[v.name] = false
      return obj
    }, {}
  )

  // Limit to show topmost n series by default, n = showOnLoad
  Object.entries(initialState).forEach(([key, ], index) => {
    if (index < showOnLoad) {
      initialState[key] = true
    }
  });

  return (
    <ChartContext.Provider value={{ id, series, initialState, defaultZoomDays }}>
      {children}
    </ChartContext.Provider>
  )
}

export function TimelineChart({ height='100%', children }) {
  const { id, series, initialState, defaultZoomDays } = useContext(ChartContext)

  const chartConfig = {
    type: 'line',
    stacked: false,
    height: height,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    series: series,
    options: {
      chart: {
        id: id,
        // https://github.com/apexcharts/apexcharts.js/issues/1138
        events: {
          mounted: function() {
            Object.entries(initialState).forEach(entry => {
              const [name, active] = entry
              if (active) {
                window.ApexCharts.getChartByID(id).showSeries(name)
              } else {
                window.ApexCharts.getChartByID(id).hideSeries(name)
              }
            })
          },
          beforeZoom: function(ctx) {
            // we need to clear the range as we only need it on the iniital load.
            ctx.w.config.xaxis.range = undefined
          }
        },
        toolbar: {
          // offsetX: -160,
          autoSelected: 'pan'
        },
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
            return (val).toFixed(1)+'%'
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
        },
        range: defaultZoomDays*86400000
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
      },
      legend: {
        show: false
        // fontSize: '14px',
        // width: 160,
        // position: 'right',
        // itemMargin: {
        //   horizontal: 8,
        //   vertical: 8
        // },
        // markers: {
        //   offsetX: '-4px'
        // },
      },
      annotations: {
        yaxis: [
          {
            y: 0,
            strokeDashArray: 5,
            borderColor: '#111827',
            borderWidth: 1,
            opacity: 1
          }
        ],
      }      
    },
  };
  
  return (
    <Chart {...chartConfig} />
  )
}

export function Legend() {
  const { id, series, initialState } = useContext(ChartContext)
  
  const [activeSeries, setActiveSeries] = useState(initialState)

  const handleToggle = (event) => {
    const { name } = event.target;

    const updatedState = {
      ...activeSeries,
      [name]: !activeSeries[name],
    };
    setActiveSeries(updatedState);
  };

  useEffect(() => {
    try {
      let chart = window.ApexCharts.getChartByID(id)
  
      Object.entries(activeSeries).forEach(entry => {
        const [name, active] = entry
        if (active) {
          chart.showSeries(name)
        } else {
          chart.hideSeries(name)
        }
      })
    } catch (error) {
    }
  }, [activeSeries])
  
  return(
    <ul>
      {series.map(bu => (
        <li>
          <label className="flex group items-center rounded-md pl-2 pr-6 py-1.5 gap-x-3 hover:cursor-pointer hover:bg-gray-50">
            <input
              id={bu.name}
              name={bu.name}
              type="checkbox"
              checked={activeSeries[bu.name]}
              onChange={handleToggle}
              style={{ backgroundColor: bu.color }}
              className={classNames(
                !activeSeries[bu.name] && 'opacity-20',
                "h-4 w-4 rounded-full text-gray-600 focus:ring-gray-600 pointer-events-none"
              )}
            />
            {/* <svg viewBox="0 0 2 2" className="h-3.5 w-3.5 rounded-full" style={{ fill: bu.color }}>
              <circle cx={1} cy={1} r={1} />
            </svg> */}
            <p className={classNames(!activeSeries[bu.name] && 'opacity-20', "text-sm leading-6 text-gray-900")}>{bu.name}</p>
          </label>
        </li>
      ))}
    </ul>
  )
}


export function RangeSelector() {
  const { id, series } = useContext(ChartContext)

  const collapsedDates = () => {
    let dateArray = []
    series.forEach(bu => (
      dateArray.push(...bu.data.map(data => new Date(data.x)))
    ))
    return dateArray
  }

  // https://stackoverflow.com/questions/26735854/how-to-return-the-lowest-date-value-and-highest-date-value-from-an-array-in-java
  const maxDate = Math.max.apply( null, collapsedDates())
  const minDate = Math.min.apply( null, collapsedDates())

  const rangeOptions = [
    {name: '1 week', value: Math.max(maxDate - 7 * 86400000, minDate)},
    {name: '1 month', value: Math.max(maxDate - 30 * 86400000, minDate)},
    {name: '3 months', value: Math.max(maxDate - 90 * 86400000, minDate)},
    {name: '1 year', value: Math.max(maxDate - 365 * 86400000, minDate)},
    {name: 'All', value: minDate}
  ]

  const defaultOption = {name: '1 month', value: 30}

  const [selectedRange, setSelectedRange] = useState(defaultOption)

  const handleRangeSelect = (event) => {
    const { value } = event.target
    setSelectedRange(value)
  };

  useEffect(() => {
    try {
      let chart = window.ApexCharts.getChartByID(id)
      chart.zoomX(selectedRange.value, maxDate)
      // chart.updateOptions({xaxis:{range:selectedRange.value}}, false, false, false)
    } catch (error) {
    }
  }, [selectedRange])
  
  return (
    <div>
      <Dropdown
        options={rangeOptions}
        selectedOption={selectedRange.name}
        onSelect={handleRangeSelect}
        className="w-40 rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      />
      {/* {selectedRange.value} {maxDate} */}
    </div>
  )
}