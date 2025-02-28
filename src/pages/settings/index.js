import Layout from '@/app/components/layout';
import { useRouter } from 'next/router';
import { UserIcon, BanknotesIcon, CameraIcon, CodeBracketIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import ApiRetrievalFrequency from '@/app/sections/settings/api_retrieval_frequency';
import SnapshotFrequency from '@/app/sections/settings/snapshot_frequency';
import Alerts from '@/app/sections/settings/alerts';
import Currencies from '@/app/sections/settings/currencies';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SettingsPage() {
  return (
      <Layout>
        <div className="bg-stone-100 min-h-full pb-16">
          <div className="mx-auto max-w-7xl pt-6 px-8">
            <SettingsHeader />
            <div className="flex gap-x-6">
              <aside className="mt-6 block shrink-0 py-4 w-64">
                <SettingsMenus />
              </aside>
              <main className="grow mt-6 pb-16 px-6 py-4 ">
                <div className="rounded-lg bg-white shadow-md p-8">
                  <CurrentSettings />
                </div>
              </main>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
function SettingsHeader() {
  return (
    <div className="flex items-baseline border-b border-gray-200">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Organization Settings</h1>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

function SettingsMenus() {
  const router = useRouter()
  const query = { ...router.query };
  const { pathname } = router;
  const currentMenu = query.menu

  const changeMenu = (slug) => {
    // Clear query so more specific queries no longer apply
    for (let q in query) delete query[q];

    query.menu = slug
    router.replace({ pathname, query }, undefined, { shallow: true });
  }

  const menus = [
    { name: 'Organization', slug: "general", icon: UserIcon },
    { name: 'Currencies', slug: "currencies", icon: BanknotesIcon },
    { name: 'Snapshot Frequency', slug: "snapshot-freq", icon: CameraIcon },
    { name: 'API Retrieval Frequency', slug: "api-freq", icon: CodeBracketIcon },
    { name: 'Alerts', slug: "alerts", icon: BellAlertIcon },
  ]

  return (
      <nav className="sticky top-8 px-4 sm:px-6 lg:px-0">
        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
          {menus.map((menu) => (
            <li key={menu.name}>
              <button
                onClick={() => changeMenu(menu.slug)}
                className={classNames(
                  menu.slug === currentMenu
                    ? 'bg-stone-200 text-stone-600'
                    : 'text-gray-700 hover:bg-stone-200 hover:text-stone-600',
                  'group flex w-full gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                )}
              >
                <menu.icon
                  aria-hidden="true"
                  className={classNames(
                    menu.slug === currentMenu
                      ? 'text-stone-600'
                      : 'text-gray-400 group-hover:text-stone-600',
                    'h-6 w-6 shrink-0',
                  )}
                />
                {menu.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
  )
}

function CurrentSettings() {
  const router = useRouter()
  const query = { ...router.query };
  const currentMenu = query.menu

  switch (currentMenu) {
    case 'general': return null
    case 'currencies': return <Currencies />
    case 'api-freq': return <ApiRetrievalFrequency />
    case 'snapshot-freq': return <SnapshotFrequency />
    case 'alerts': return <Alerts />
    default: return null
  }
}


