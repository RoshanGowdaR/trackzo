'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Plus, Search, AlertCircle, TrendingDown } from 'lucide-react'

const materials: any[] = []

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Materials</h1>
              <p className="text-secondary-400">Inventory management and stock tracking</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Material
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-500" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-sm rounded-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Material</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Quantity</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Unit Price</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Total Value</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b border-white/5 hover:bg-secondary-800/30">
                  <td className="py-4 px-6 font-semibold text-white">{material.name}</td>
                  <td className="py-4 px-6 text-secondary-400">{material.category}</td>
                  <td className="py-4 px-6 text-secondary-400">
                    {material.quantity.toLocaleString()} {material.unit}
                  </td>
                  <td className="py-4 px-6 text-secondary-400">
                    ₹{material.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">
                    ₹{(material.quantity * material.price).toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      material.status === 'in_stock'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {material.status === 'low_stock' && <AlertCircle className="w-3 h-3" />}
                      {material.status === 'in_stock' ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
