import { useState } from 'react'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { NumberInput } from './numberinput'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// const inputClass = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 leading-6"
// const pClass = "mt-2 py-1.5 text-gray-500"
export function EditableField({ defaultValue, inputClass, pClass, unit, onSave, children }) {
  const [isEdit, setIsEdit] = useState(false)

  const handleSave = (event) => {
    onSave(event)
    setIsEdit(false)
  }

  return (
    <div className="relative">
      {isEdit &&
        <div className="absolute inset-y-0 -ml-2 flex items-center gap-x-2 mr-2">
          <div className="relative">
            <NumberInput
              value={defaultValue}
              className={inputClass}
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 sm:text-sm">
              {unit}
            </span>
          </div>
          <button
            className="p-1 rounded-md text-red-400 hover:text-red-400 bg-red-50 hover:bg-red-100"
            onClick={() => setIsEdit(false)}
          >  
            <XMarkIcon 
              className="h-5 w-5"
            />
          </button>
          <button
            className="p-1 rounded-md text-green-400 hover:text-green-400 bg-green-50 hover:bg-green-100"
            onClick={handleSave}
          >  
            <CheckIcon 
              className="h-5 w-5"
          />
          </button>
        </div>
      }
      {/* Do not hide when edit to keep <td/> the same width, make text transparent instead */}
      <div className={classNames(pClass, "flex items-center gap-x-3", isEdit && "text-transparent")}>
        {children}
        <button
          className="text-gray-500 hover:text-sky-600"
          onClick={() => setIsEdit(true)}
        >  
          <PencilSquareIcon 
            className="h-4 w-4"
          />
        </button>
      </div>
    </div>
  )
}