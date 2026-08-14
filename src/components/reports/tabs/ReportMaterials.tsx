'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'

interface Filters {
  dateRange: { start: string; end: string }
  project: string
  material: string
  workStage: string
  supplier: string
  paymentStatus: string
  search: string
}

export default function ReportMaterials({ filters }: { filters: Filters }) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)

  const materials: any[] = []

  const workStages: any[] = []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((material, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMaterial(material.name)}
            className={`bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border rounded-2xl p-6 backdrop-blur-sm cursor-pointer transition-all ${
              selectedMaterial === material.name ? 'border-primary-500' : 'border-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary-600/20">
                  <Package className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{material.name}</h3>
                  <p className="text-sm text-secondary-400">{material.quantity} {material.unit}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-400">Total Cost</p>
                <p className="text-lg font-bold text-primary-400">₹{material.cost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-secondary-400">Avg Rate</p>
                <p className="text-lg font-bold text-accent-400">₹{material.avgRate}</p>
              </div>
              <div>
                <p className="text-secondary-400">Suppliers</p>
                <p className="text-lg font-bold text-white">{material.suppliers}</p>
              </div>
              <div>
                <p className="text-secondary-400">Last Purchase</p>
                <p className="text-sm font-semibold text-secondary-300">{material.lastPurchase}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Work Stage Summary */}
      {selectedMaterial && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Work Stage Summary - {selectedMaterial}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-secondary-400 font-semibold">Work Stage</th>
                  <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Quantity</th>
                  <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Cost</th>
                  <th className="text-center py-3 px-4 text-secondary-400 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {workStages.map((stage, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-secondary-800/20">
                    <td className="py-3 px-4 text-white">{stage}</td>
                    <td className="py-3 px-4 text-right text-secondary-300">1,250 units</td>
                    <td className="py-3 px-4 text-right text-primary-400 font-semibold">₹{(70000 * (5-index)).toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-24 h-2 bg-secondary-700 rounded-full overflow-hidden mx-auto">
                        <div
                          className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                          style={{ width: `${80 - index * 15}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
