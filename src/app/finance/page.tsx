'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SafeChart from '@/components/SafeChart'

export default function FinancePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const expenseData: any[] = []

  const totalIncome = 0
  const totalExpense = 0
  const profit = 0

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Finance</h1>
              <p className="text-secondary-400">Income, expenses, and financial reports</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Expense
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Total Income', value: '₹0', color: 'from-green-600 to-green-400' },
            { label: 'Total Expenses', value: '₹0', color: 'from-red-600 to-red-400' },
            { label: 'Profit', value: '₹0', color: 'from-primary-600 to-primary-400' },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`card bg-gradient-to-br ${card.color} bg-opacity-10 border border-white/10`}
            >
              <p className="text-secondary-400 text-sm mb-2">{card.label}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Expense Breakdown */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Expense Breakdown</h2>
            <div className="space-y-4">
              {expenseData.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-secondary-300">{item.category}</span>
                    <span className="text-white font-semibold">₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-secondary-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Flow */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Cash Flow</h2>
            {mounted && (
              <SafeChart
                options={{
                  chart: { background: 'transparent', width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, toolbar: { show: false } },
                  colors: ['#22c55e', '#ef4444'],
                  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { colors: '#94a3b8' } } },
                  yaxis: { labels: { style: { colors: '#94a3b8' } } },
                  grid: { borderColor: 'rgba(148, 163, 184, 0.1)' },
                  tooltip: { theme: 'dark' },
                }}
                series={[
                  { name: 'Income', data: [40000, 45000, 50000, 48000, 52000, 55000] },
                  { name: 'Expense', data: [35000, 40000, 42000, 41000, 45000, 47000] },
                ]}
                type="line"
                height={250}
              />
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
