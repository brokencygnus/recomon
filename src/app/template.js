import Layout from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function APIPage() {
  const breadcrumbPages = [
    { name: 'Previous Page', href: '#', current: true },
    { name: 'Your Page', href: '#', current: true },
  ]

  return (
      <Layout>
        <main className="py-10 px-12 2xl:px-16">
          <Breadcrumbs breadcrumbPages={breadcrumbPages} />
          <YourPageHeader />
          {/* Content */}
        </main>
      </Layout>
    )
  }
  
function YourPageHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Title</h1>
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