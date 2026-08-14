'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Plus, FileText } from 'lucide-react'

const estimations: any[] = []

export default function EstimationPage() {
  const [selectedProject, setSelectedProject] = useState('all')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Construction Estimation</h1>
              <p className="text-secondary-400">Project cost estimation and BOQ management</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Estimation
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Total Estimated Cost', value: '₹0' },
            { label: 'Estimation Accuracy', value: '0%' },
            { label: 'Active Estimations', value: '0' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="card"
            >
              <p className="text-secondary-400 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Estimations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Project</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Description</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Quantity</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {estimations.map((est) => (
                <tr key={est.id} className="border-b border-white/5 hover:bg-secondary-800/30">
                  <td className="py-4 px-6 font-semibold text-white">{est.project}</td>
                  <td className="py-4 px-6 text-secondary-400">{est.category}</td>
                  <td className="py-4 px-6 text-secondary-400">{est.description}</td>
                  <td className="py-4 px-6 text-secondary-400">
                    {est.quantity} {est.unit}
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">
                    ₹{est.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      est.status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {est.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Generate BOQ Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full btn-accent flex items-center justify-center gap-2 py-3 rounded-xl font-semibold"
        >
          <FileText className="w-5 h-5" />
          Generate BOQ & PDF Report
        </motion.button>
      </div>
    </DashboardLayout>
  )
}
