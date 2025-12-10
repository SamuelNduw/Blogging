import { Dialog, DialogPanel } from '@headlessui/react'
import { useState, useEffect } from 'react'

export default function ImageModal({ imageUrl}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger */}
      <button onClick={() => setIsOpen(true)} className="p-2 bg-blue-600 text-white rounded-md">
        View Image
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-4xl w-full rounded bg-white shadow-lg overflow-hidden">
            <img src={imageUrl} alt="Generated" className="w-full h-auto object-contain" />
            <div className="p-2 text-right">
              <button onClick={() => setIsOpen(false)} className="mt-2 text-sm text-blue-600 hover:underline">
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
