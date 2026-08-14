'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeChart from '@/components/SafeChart'

interface Filters {
  dateRange: { start: string; end: string }
  project: string
  material: string
  workStage: string
  supplier: string
  paymentStatus: string
  search: string
}

export default function ReportAnalytics({ filters }: { filters: Filters }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const topSpendingOptions = {
    chart: { type: 'bar' as const, toolbar: { show: true } },
    colors: ['#2563EB'],
    xaxis: { categories: ['Cement', 'Steel', 'Bricks', 'Sand', 'Paint'] },
    plotOptions: { bar: { horizontal: true } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  }

  const topSpendingSeries = [
    { name: 'Spending', data: [350000, 280000, 180000, 150000, 120000] },
  ]

  const costVarianceOptions = {
    chart: { type: 'pie' as const, toolbar: { show: true } },
    colors: ['#22C55E', '#F59E0B', '#EF4444'],
    labels: ['Within Budget', 'Over Budget', 'Under Budget'],
    tooltip: { theme: 'dark' as const },
  }

  const costVarianceSeries = [65, 20, 15]

  const kpis = [
    { label: 'Top Spending Material', value: 'Cement', subvalue: '₹3.5L' },
    { label: 'Highest Cost Stage', value: 'Foundation', subvalue: '₹8.5L' },
    { label: 'Most Expensive Supplier', value: 'Steel Industries', subvalue: '₹2.8L' },
    { label: 'Avg Daily Expense', value: '₹45,000', subvalue: '+5% vs last week' },
    { label: 'Purchase Frequency', value: '3.2x/week', subvalue: 'Average' },
    { label: 'Material Wastage', value: '2.3%', subvalue: 'Within acceptable range' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <p className="text-secondary-400 text-sm mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-secondary-400">{kpi.subvalue}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Top Spending Materials</h3>
          <SafeChart
            options={topSpendingOptions}
            series={topSpendingSeries}
            type="bar"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Cost Variance</h3>
          <SafeChart
            options={costVarianceOptions}
            series={costVarianceSeries}
            type="pie"
            height={300}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
