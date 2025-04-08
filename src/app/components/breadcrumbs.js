import { IconChevronRight, IconHome } from "@tabler/icons-react";
// const breadcrumbPages = [
//   { name: 'a', href: '#', current: false },
//   { name: 'b', href: '#', current: true },
// ]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Breadcrumbs({ breadcrumbPages }) {
return (
  <nav aria-label="Breadcrumb">
    <ol role="list" className="flex items-center gap-x-1">
      <li>
        <a href="/dashboard" className="flex h-7 text-zinc-500 rounded-lg hover:bg-zinc-50 hover:text-zinc-700">
            <IconHome className="size-5 m-1 flex-shrink-0" aria-hidden="true" />
            <span className="sr-only">Home</span>
        </a>
      </li>
      {breadcrumbPages && breadcrumbPages.map((page) => (
        <li key={page.name}>
          <div className={classNames("flex items-center", page.current)}>
            <IconChevronRight className="size-4 m-1 flex-shrink-0 text-gray-300" aria-hidden="true" />
            <a
              href={!page.current ? page.href : null}
              className={classNames("flex items-center h-7 px-3 rounded-lg text-sm font-semibold", page.current ? "bg-zinc-50 text-zinc-800" : "text-zinc-600 hover:text-zinc-800 hover:bg-zinc-50")}
              aria-current={page.current ? 'page' : undefined}
            >
              {page.name}
            </a>
          </div>
        </li>
      ))}
    </ol>
  </nav>
  )
}
    