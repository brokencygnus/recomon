import Layout from '@/app/components/layout';
import { useMemo, useState, useEffect } from 'react';
import { TimelineChart } from '@/app/components/charts'

import { snapshotBusinessUnits } from '@/app/constants/mockdata/snapshot_mockdata'
import { stringToColor } from '@/app/components/stringToColor';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const chartSeries = snapshotBusinessUnits.map(bu => (
  {
    name: bu.name,
    color: stringToColor(bu.slug, {maxLum:80, minLum:40, maxSat:60, minSat:60}),
    data:bu.snapshots.map(snap => (
      {x:snap.date, y:snap.gap*100/snap.capital}
    ))
  }
))

export default function APIPage() {
  return (
      <Layout>
        <main className="py-10 px-12 2xl:px-16">
          <DashboardHeader />
          <TimelineChart series={chartSeries} >
            {/* It's not my idea to pass html strings, it's apexcharts' fault */}
            {/* {{ tooltip: function({series, seriesIndex, dataPointIndex, w}) {
              return `
                <div class="w-32">
                  <span>${series[seriesIndex][dataPointIndex]}</span>
                </div>
              `
            }}} */}
          </TimelineChart>
          {/* Content */}
        </main>
      </Layout>
    )
  }
  
function DashboardHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-700">This is 404, by the way</p>
            </div>
          </header>
        </div>
      </div>
      <div className="flex items-end">
      {/* Buttons etc. go here */}
      </div>
    </div>
  );
}

