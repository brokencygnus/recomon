function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// discrepancy: -2 | -1 | -0 | 1 | 2
export function DiscLabel({ discrepancy }) {
  var color = ""
  switch (discrepancy) {
    case -2: case 2:
      color = "border-red-100 bg-red-50 text-red-600"
      break
    case -1: case 1:
      color = "border-amber-100 bg-amber-50 text-amber-600"
      break
    default:
      color = "border-sky-100 bg-sky-50 text-sky-600"
      break
  }

  var text = ""
  switch (discrepancy) {
    case 2: text = "Critical High"; break
    case 1: text = "High"; break
    case 0: text = "Normal"; break
    case -1: text = "Low"; break
    case -2: text = "Critical Low"; break
    default: text = "Unknown"
  }
  
  return (
    <div className={classNames("flex items-center justify-center shrink-0 w-fit rounded-full px-2 py-1 border-2", color)}>
      <p className={"font-medium, text-xs leading-none"}>{text}</p>
    </div>
  )
}