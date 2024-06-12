'use client'
import { useState } from 'react'
// add children with text, e.g. Rp or $

// 32x32
export function FiatIconSmall({ children }) {
  return (    
    <div className="overflow-hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 border-4 border-gray-400 text-white text-lg font-bold">
      {children}
    </div>
  );
}

// 48x48
export function FiatIconMedium({ children }) {
  return (
    <div className="overflow-hidden flex items-center justify-center w-12 h-12 rounded-full bg-gray-400 border-4 border-gray-400 text-white text-2.5xl font-bold">
      {children}
    </div>
  )
}

// 64x64
export function FiatIconLarge({ children }) {
  return (
    <div className="overflow-hidden flex items-center justify-center w-16 h-16 rounded-full bg-gray-400 border-4 border-gray-400 text-white text-4xl font-bold">
      {children}
    </div>
  )
}