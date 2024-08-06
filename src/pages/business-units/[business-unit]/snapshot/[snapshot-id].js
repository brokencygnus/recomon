import { ReconciliationHeader, ReconciliationSection } from '@/pages/business-units/[business-unit]/index'
import { useRouter } from 'next/router';
import { useState, createContext } from 'react';
import Layout from '@/app/components/layout';
import { getDiscrLvl } from '@/app/utils/business-units/discrepancy-color'
import { convertShortDate } from '@/app/utils/dates';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

// Mock data start

import { businessUnits } from '@/app/constants/mockdata/mockdata'
import { exchangeCurrencies, exchangeSummary } from "@/app/constants/mockdata/exchange_mockdata";

const businessUnit = businessUnits[0]
const snapshotTime = "2024-05-20T11:00Z"

// Mock data end

export default function SnapshotDetailsPage() {
  const router = useRouter()

  const snapshotID = router.query["snapshot-id"];

  const breadcrumbPages = [
    { name: 'Snapshots', href: '/snapshots', current: false },
    { name: 'Snapshot ' + snapshotID, href: '#', current: true },
  ]

  const [buAlerts, setBuAlerts] = useState([])

  const addBuAlerts = (newAlert) => {
    if (!buAlerts.some(alert => alert === newAlert)) {

      // Critical currency blocks unacceptable currency
      if (!(newAlert === "gap_unacceptable_currency" && buAlerts.some(alert => alert === "gap_critical_currency"))) {
        setBuAlerts([...buAlerts, newAlert])
      }
      // Critical currency replaces unacceptable currency
      if (newAlert === "gap_critical_currency" && buAlerts.some(alert => alert === "gap_unacceptable_currency")) {
        const newBuAlerts = buAlerts.filter(alert => alert !== "gap_unacceptable_currency")
        setBuAlerts([...newBuAlerts, newAlert])
      }
    }
  }

  switch (getDiscrLvl({
    discrepancy: exchangeSummary.discrepancy,
    discrAlertConf: exchangeSummary.discrAlertConf,
    capital: exchangeSummary.capital
  })) {
    case "critical":
      addBuAlerts("gap_critical_entireBU")
      break
    case "unacceptable":
      addBuAlerts("gap_unacceptable_entireBU")
      break
  }
  
  return (
    <Layout currentTab="bu" breadcrumbPages={breadcrumbPages}>
      <main className="relative min-h-full pt-10 py-10 px-12 2xl:px-16 bg-gray-50">
        <div className="absolute inset-x-0 -mt-10">
          <SnapshotBanner
            businessUnit={businessUnit}
            snapshotTime={snapshotTime}
            prevSnapHref='#'
            nextSnapHref='#'
          />
        </div>
        <div className="mt-10">
          <ReconciliationHeader
            businessUnit={businessUnit}
            buAlerts={buAlerts}
            snapshotID={snapshotID}
          />
          <div className="flex grow flex-col mt-8">
            <ReconciliationSection
              businessUnit={businessUnit}
              currencyData={exchangeCurrencies}
              summaryData={exchangeSummary}
              addBuAlerts={addBuAlerts}
              snapshotID={snapshotID}
              snapshotTime={new Date(snapshotTime)}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}

function SnapshotBanner({businessUnit, snapshotTime, prevSnapHref="#", nextSnapHref="#"}) {
  return (
    <div className="grid grid-cols-5 bg-gray-900 px-6 py-2.5">

      {/* TODO for demonstration purposes these will be displayed. If prevSnapHref is null, hide this <a> */}
      {true ? 
        <a href={prevSnapHref} className="flex items-center justify-start gap-x-3 text-sm text-white">
          <ArrowLeftIcon className="w-4 h-4" />
          <p>Prev snapshot</p>
        </a>
      : <div>{/* Empty div */}</div>}
      
      <div className="flex justify-center col-span-3">
        <p className="text-sm leading-6 text-white">
          You’re viewing a snapshot of&nbsp;
            <span>{businessUnit.name}</span>
            &nbsp;dated&nbsp;
            <span>{convertShortDate(new Date(snapshotTime))}</span>
        </p>
      </div>

      {/* Same as above */}
      {true ? 
      <a href={nextSnapHref} className="flex items-center justify-end gap-x-3 text-sm text-white">
        <p>Next snapshot</p>
        <ArrowRightIcon className="w-4 h-4 text-white" />
      </a>
      : <div>{/* Empty div */}</div>}
    
    </div>
  )
}
