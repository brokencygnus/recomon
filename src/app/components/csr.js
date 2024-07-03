// Converts a component to CSR without exporting a whole ass module
// Example usage:
//
//  <ClientOnly>
//    <date thing that changes every second that causes hydration errors/>
//  </ClientOnly>

import dynamic from 'next/dynamic';

const ClientOnly = (props) => {
  const { children } = props

  return children;
}

export default dynamic(() => Promise.resolve(ClientOnly), {ssr: false})