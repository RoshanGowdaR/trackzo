'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeChart from '@/components/SafeChart'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface Filters {
  dateRange: { start: string; end: string }
  project: string
  material: string
  workStage: string
  supplier: string
  paymentStatus: string
  search: string
}

export default function ReportFinancial({ filters }: { filters: Filters }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const financialMetrics: any[] = [
    { label: 'Total Inflow', value: 850000, color: 'text-emerald-400', bg: 'bg-emerald-900/20', icon: '💰' },
    { label: 'Total Outflow', value: 540000, color: 'text-amber-400', bg: 'bg-amber-900/20', icon: '💸' },
    { label: 'Net Profit', value: 310000, color: 'text-blue-400', bg: 'bg-blue-900/20', icon: '📈' },
    { label: 'Pending Receivables', value: 120000, color: 'text-purple-400', bg: 'bg-purple-900/20', icon: '⏳' },
  ]

  const cashFlowOptions: any = {
    chart: { type: 'line' as const, toolbar: { show: true } },
    colors: ['#22C55E', '#EF4444'],
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    stroke: { curve: 'smooth' as const, width: 3 },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
    legend: { position: 'top' as const },
  }

  const cashFlowSeries = [
    { name: 'Inflow', data: [150000, 220000, 180000, 300000] },
    { name: 'Outflow', data: [110000, 140000, 120000, 170000] },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className={`${metric.bg} border border-white/10 rounded-2xl p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={metric.color}>{metric.icon}</div>
            </div>
            <p className="text-secondary-400 text-sm mb-2">{metric.label}</p>
            <p className={`text-3xl font-bold ${metric.color}`}>₹{(metric.value / 100000).toFixed(1)}L</p>
          </motion.div>
        ))}
      </div>

      {/* Cash Flow Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-6">Cash Flow Analysis</h3>
        <SafeChart
          options={cashFlowOptions}
          series={cashFlowSeries}
          type="line"
          height={300}
        />
      </motion.div>

      {/* Financial Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-6">Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-secondary-400 font-semibold">Metric</th>
                <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Amount</th>
                <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Budget Utilization</td>
                <td className="py-3 px-4 text-right text-primary-400 font-semibold">₹16.25L</td>
                <td className="py-3 px-4 text-right text-primary-400">65%</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Savings</td>
                <td className="py-3 px-4 text-right text-green-400 font-semibold">₹8.75L</td>
                <td className="py-3 px-4 text-right text-green-400">35%</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Profit Margin</td>
                <td className="py-3 px-4 text-right text-green-400 font-semibold">₹8.75L</td>
                <td className="py-3 px-4 text-right text-green-400">35%</td>
              </tr>
              <tr className="hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white font-semibold">Cost Variance</td>
                <td className="py-3 px-4 text-right text-yellow-400 font-semibold">₹1.5L</td>
                <td className="py-3 px-4 text-right text-yellow-400">6%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
