"use client"

import { useState } from "react"
import { X, ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedClient, setSelectedClient] = useState("")

  const clients = ["Acme Corporation", "TechStart Inc.", "Global Solutions Ltd.", "Innovation Hub", "Digital Dynamics"]

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Générer une facture</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Sélectionner un client</label>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-300"
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {selectedClient && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  Client sélectionné: <span className="font-medium">{selectedClient}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="px-6">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedClient) {
                alert(`Facture générée pour ${selectedClient}`)
                setIsOpen(false)
              }
            }}
            disabled={!selectedClient}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            Générer
          </Button>
        </div>
      </div>
    </div>
  )
}
