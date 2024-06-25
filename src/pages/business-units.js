import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react'
import Layout, {RefCurContext, convertedCurrency} from '@/app/components/layout';
import { Breadcrumbs } from '@/app/components/breadcrumbs';
import { Modal } from '@/app/components/modal';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { businessUnits } from '@/app/constants/mockdata'
import { checkDataEdited } from '@/app/utils/utils'
import { HighlightSearch, SearchFilter } from '@/app/utils/highlight_search';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { ToastContext } from '@/app/components/toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ModalContext = React.createContext(null);

export default function APIPage() {
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const breadcrumbPages = [
    { name: 'Business Units', href: '#', current: true },
  ]

  // modal
  var isModalOpen = (["new", "edit"].includes(router.query.action) ? true : false)
  var [modalAction, setModalAction] = useState(router.query.action)
  var modalData = businessUnits.find((bu) => 
    bu.slug == router.query.edit || bu.slug == router.query.delete
  )

  // modalData = accounts[index]
  // mode = "edit" | "new"
  const openModal = (modalData, mode) => {
    if (mode === "edit") {
      setModalAction("edit");
      query.action = "edit";
      query.edit = modalData.slug;
    } else if (mode === "new") {
      setModalAction("new");
      query.action = "new";
    } else if (mode === "delete") {
      setModalAction("delete");
      query.action = "delete";
      query.delete = modalData.slug;
    }

    router.replace({ pathname, query }, undefined, { shallow: true });
  }

  const closeModal = () => {
    setModalAction("");
    router.replace({
      pathname: '/business-units',
    }, 
      undefined,
      { shallow: true }
    );
  }

  // Prevent race condition when page is loaded but router query is still undefined
  useEffect(() => {
    if (!modalAction) {
      setModalAction(router.query.action)
    }
  }, [router.query.action])

  const [filteredBusinessUnits, setFilteredBusinessUnits] = useState(businessUnits);
  const [searchTerm, setSearchTerm] = useState([]);

  const handleSearchChange = (event) => {
    const { value } = event.target

    const searchArray = value.split(" ")

    setSearchTerm(searchArray)
  }

  const handleResetFilters = () => {
    setSearchTerm([])
  }

  useEffect(() => {
    const tempFilteredBusinessUnits = businessUnits.filter(bu =>
      (searchTerm.length == 0 || searchTerm.length == 1 && searchTerm[0] == '' || SearchFilter(bu.name, searchTerm))
    )
    
    setFilteredBusinessUnits(tempFilteredBusinessUnits)
  }, [businessUnits, searchTerm])

  return (
    <Layout currentTab="bu">
      <ModalContext.Provider value={{ modalData, modalAction }}>
        <main className="flex-grow relative bg-gray-100">
          <div className="bg-white pt-10 px-12 2xl:px-16">
            <Breadcrumbs breadcrumbPages={breadcrumbPages} />
            <BusinessUnitsHeader />
          </div>
          <div className="sticky top-16 bg-white px-12 2xl:px-16 z-[2]">
            <BusinessAccountFilter
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleResetFilters={handleResetFilters}
              openModal={openModal}
            />
          </div>
          <div className="sticky top-[5.5rem] w-full h-10 bg-white z-[1] shadow-md"></div>
          <Modal
            open={isModalOpen}
            setClose={closeModal}
            panelTitle={modalAction === "edit" ? "Edit Business Unit" : "New Business Unit"}
          >
            <EditBusinessUnit setClose={closeModal}/>
          </Modal>
          <DeleteDialog
            setClose={closeModal}
          />
          <div className="relative flex-grow px-12 2xl:px-16">
            <BusinessUnitGrid
              businessUnits={filteredBusinessUnits}
              openModal={openModal}
              searchTerm={searchTerm}
            />
            <div className="h-16 sticky bottom-0 z-10 pointer-events-none bg-gradient-to-t from-gray-100 to-transparent"></div>
          </div>
        </main>
      </ModalContext.Provider>
    </Layout>
    )
  }
  
function BusinessUnitsHeader() {
  return (
    <div className="flex items-center">
      <div className="flex-auto">
        <div className="py-4">
          <header>
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Business Units</h1>
              <p className="mt-2 text-sm text-gray-700">Business units maintain their own financial accounts, ensuring that their assets and liabilities are not factored into other units.</p>
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

function BusinessAccountFilter({ searchTerm, handleResetFilters, handleSearchChange, openModal }) {
  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-end mt-2 gap-x-3">
        <form className="flex rounded-md w-fit h-9 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
          <input
            id="search-business-units"
            className="border-0 py-0 px-0 mx-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search business unit"
            value={searchTerm.join(" ")}
            onChange={handleSearchChange}
            type="text"
            name="search"
          />
          <MagnifyingGlassIcon
            className="pointer-events-none w-5 mx-2 text-gray-400"
            aria-hidden="true"
          />
        </form>

        <div>
          <button
            type="button"
            className="h-10 rounded px-2 py-1 text-sm font-semibold text-indigo-600"
            onClick={handleResetFilters}
          >
            Reset search
          </button>
        </div>
      </div>
        <div className="flex items-end">
          {/* <a
            href='#'
            className="h-10 flex items-center rounded px-2 py-1 text-sm font-semibold text-indigo-600"
          >
            View snapshots
          </a> */}
          <button
            type="button"
            onClick={() => openModal({}, "new")}
            className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add business unit
          </button>
        </div>
    </div>
  )
}


export function BusinessUnitGrid({ businessUnits, searchTerm }) {
  const { referenceCurrency } = useContext(RefCurContext)

  // Somehow passing openModal here causes errors, idk
  // So I guess this is boilerplate now
  const router = useRouter()
  const { pathname } = router;
  const query = { ...router.query };

  const openModal = (modalData, mode) => {
    if (mode === "edit") {
      query.action = "edit";
      query.edit = modalData.slug;
    } else if (mode === "new") {
      query.action = "new";
    } else if (mode === "delete") {
      query.action = "delete";
      query.delete = modalData.slug;
    }

    router.replace({ pathname, query }, undefined, { shallow: true });
  }

  const convert = (amount, currency) => convertedCurrency(amount, currency, referenceCurrency)

  // I don't think this is how you use OOP but OOK
  const menuOptions = {
    view: { 
      name: "View", 
      onClick: (bu) => router.push(`business-unit/${bu.slug}`), 
      className: "block px-3 py-1 text-sm leading-6 text-gray-900" 
    },
    accounts: { 
      name: "Accounts", 
      onClick: (bu) => router.push(`business-unit/${bu.slug}/accounts`), 
      className: "block px-3 py-1 text-sm leading-6 text-gray-900" 
    },
    snapshots: { 
      name: "Snapshots", 
      onClick: (bu) => router.push(`snapshots/${bu.slug}`), 
      className: "block px-3 py-1 text-sm leading-6 text-gray-900" 
    },
    edit: { 
      name: "Edit", 
      onClick: (bu) => openModal(bu, "edit"), 
      className: "block px-3 py-1 text-sm leading-6 text-gray-900" 
    },
    delete: { 
      name: "Delete", 
      onClick: (bu) => openModal(bu, "delete"), 
      className: "block px-3 py-1 text-sm leading-6 text-red-600" 
    },
  };

  return (
    <ul role="list" className="relative grid grid-cols-2 py-8 gap-x-6 gap-y-8 2xl:gap-x-8 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
      {businessUnits.map((businessUnit) => (
          <li key={businessUnit.id} className="overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-900/5">
            <a 
              // href={menuOptions.view.href(businessUnit.slug)}
              className="block"
            >
              <div className="bg-gray-50 hover:bg-gray-100 p-6">
                <div className="flex items-baseline gap-x-4">
                  <h3 className="text-lg font-semibold leading-6 truncate text-gray-900">{HighlightSearch(businessUnit.name, searchTerm, { base:'', highlight:'bg-indigo-300' })}</h3>
                  <p className="text-sm leading-6 text-gray-400">{businessUnit.code}</p>
                  <Menu as="div" className="relative ml-auto">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                    </MenuButton>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="pointer-events-none absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {Object.keys(menuOptions).map((option) => (
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                // href={menuOptions[option]?.href(businessUnit.slug)}
                                onClick={() => menuOptions[option].onClick(businessUnit)}
                                className={classNames(
                                  focus ? 'bg-gray-50' : '',
                                  "text-left pointer-events-auto w-full",
                                  menuOptions[option].className,
                                )}
                              >
                                {menuOptions[option].name}
                              </button>
                            )}
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
                <p className="text-sm text-gray-400 h-24 line-clamp-4 pt-4">
                  {businessUnit.description}
                </p>
              </div>
            </a>
            <dl className="flex flex-col pb-3 -my-1 bg-white border-t border-gray-900/5 divide-y divide-gray-100 px-6 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Accounts</dt>
                <dd className="text-gray-400">
                  {businessUnit.accounts}
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Currencies</dt>
                <dd className="text-gray-400">
                  {businessUnit.currencies}
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total capital</dt>
                <dd className="text-gray-400">
                  {convert(businessUnit.balance, "USD")}
                </dd>
              </div>
            </dl>
          </li>
      ))}
    </ul>
  )
}

// modalData = businessUnits[index]
// mode = "edit" | "new"
// slug should be generated automatically
function EditBusinessUnit({ setClose }) {
  const { modalData, modalAction } = useContext(ModalContext)
  
  const initialState = {
    code: modalData?.code ?? '',
    name: modalData?.name ?? '',
    description: modalData?.description ?? '',
  }

  const [formState, setFormState] = useState(initialState);
  const [isDataEdited, setIsDataEdited] = useState(false)

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    const updatedState = {
      ...formState,
      [name]: value,
    }

    setFormState(updatedState);
    checkDataEdited(initialState, updatedState, setIsDataEdited)
  };

  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    if (modalAction == "edit") {
      addToast({ color: "green", message: "Business unit details edited!" })
    } else if (modalAction == "new") {
      addToast({ color: "green", message: "New business unit created!" })
    }
  }
  
  const handleSubmit = () => {
    // Enter save logic here
    launchToast()
    setClose()
  }

  return (
    <div className="w-[50rem]">
      <form id="edit-account-form">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">

            <div className="grid grid-cols-4 gap-x-6 gap-y-8">
              <div className="flex grid grid-cols-3 col-span-4 gap-x-6 ">
                <div className="">
                  <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                    Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={formState.code}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="MBSU"
                    />
                  </div>
                </div>

                <div className="grow-x col-span-2">
                  <label htmlFor="accountName" className="block text-sm font-medium leading-6 text-gray-900">
                    Account name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formState.name}
                      onChange={handleFormChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="My Business Unit"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex justify-between">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <span className="text-sm leading-6 text-gray-500" id="email-optional">
                    Optional
                  </span>
                </div>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    value={formState.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a short description of the business unit.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button 
            onClick={setClose}
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className={classNames(
              isDataEdited ? "bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "bg-gray-300 text-gray-500 pointer-events-none",
              "rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
            )}
          >
            {modalAction == "edit" ? "Save ": "Submit"}
          </button>
        </div>
      </form>

      {/* debug */}
      {/* {JSON.stringify(formState)} */}
    </div>
  )
}

function DeleteDialog({ setClose }) {
  const { modalData, modalAction } = useContext(ModalContext)

  const isOpen = modalAction == "delete" ? true : false

  const { addToast } = useContext(ToastContext)
  const launchToast = () => {
    addToast({ color: "red", message: "Business unit deleted!" })
  }

  const handleDelete = () => {
    // Delete logic here
    launchToast()
    setClose()
  }

  const buName = modalData?.name

  return (
    <Dialog size="lg" open={isOpen} onClose={setClose}>
      <DialogTitle>Confirm delete?</DialogTitle>
      <DialogDescription className="text-gray-900">
        Continuing will delete {buName} along with its accounts, snapshots, and configurations. This cannot be undone!
      </DialogDescription>
      <DialogActions>
        <button
          type="button"
          onClick={setClose}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="bg-rose-600 hover:bg-rose-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md px-3 py-2 text-sm font-semibold shadow-sm">
          Delete
        </button>
      </DialogActions>
    </Dialog>
  )
}