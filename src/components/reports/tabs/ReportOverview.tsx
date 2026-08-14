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

export default function ReportOverview({ filters }: { filters: Filters }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-80 bg-secondary-800/20 rounded-2xl animate-pulse" />
  }

  // Chart Options
  const budgetVsExpenseOptions: any = {
    chart: { type: 'bar' as const, width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, toolbar: { show: true } },
    colors: ['#2563EB', '#06B6D4'],
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'] },
    plotOptions: { bar: { columnWidth: '55%' } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
    legend: { position: 'top' as const },
  }

  const budgetVsExpenseSeries = [
    { name: 'Budget', data: [50000, 60000, 75000, 90000, 110000] },
    { name: 'Expense', data: [42000, 51000, 68000, 82000, 95000] },
  ]

  const monthlyExpenseOptions: any = {
    chart: { type: 'line' as const, toolbar: { show: true } },
    colors: ['#F59E0B'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    stroke: { curve: 'smooth' as const, width: 3 },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  }

  const monthlyExpenseSeries = [
    { name: 'Expenses', data: [25000, 32000, 45000, 38000, 52000, 48000, 61000] },
  ]

  const cashFlowOptions: any = {
    chart: { type: 'area' as const, toolbar: { show: true } },
    colors: ['#22C55E'],
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    fill: { type: 'gradient' as const },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
  }

  const cashFlowSeries = [
    { name: 'Cash Flow', data: [15000, 28000, 35000, 42000] },
  ]

  const materialDistributionOptions: any = {
    chart: { type: 'donut' as const, toolbar: { show: true } },
    colors: ['#2563EB', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'],
    labels: ['Cement', 'Steel', 'Bricks', 'Sand', 'Paint'],
    tooltip: { theme: 'dark' as const },
  }

  const materialDistributionSeries = [35, 25, 20, 12, 8]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Expense */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Budget vs Expense</h3>
          <SafeChart
            options={budgetVsExpenseOptions}
            series={budgetVsExpenseSeries}
            type="bar"
            height={300}
          />
        </motion.div>

        {/* Monthly Expense Trend */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Monthly Expense Trend</h3>
          <SafeChart
            options={monthlyExpenseOptions}
            series={monthlyExpenseSeries}
            type="line"
            height={300}
          />
        </motion.div>

        {/* Cash Flow */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Cash Flow</h3>
          <SafeChart
            options={cashFlowOptions}
            series={cashFlowSeries}
            type="area"
            height={300}
          />
        </motion.div>

        {/* Material Cost Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Material Cost Distribution</h3>
          <SafeChart
            options={materialDistributionOptions}
            series={materialDistributionSeries}
            type="donut"
            height={300}
          />
        </motion.div>
      </div>

      {/* Summary Stats Table */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-secondary-900/50 to-secondary-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-6">Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-secondary-400 font-semibold">Metric</th>
                <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Value</th>
                <th className="text-right py-3 px-4 text-secondary-400 font-semibold">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Budget Utilization</td>
                <td className="py-3 px-4 text-right text-primary-400 font-semibold">65%</td>
                <td className="py-3 px-4 text-right text-green-400">↑ 5%</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Pending Payments</td>
                <td className="py-3 px-4 text-right text-yellow-400 font-semibold">₹1,75,000</td>
                <td className="py-3 px-4 text-right text-red-400">↑ 12%</td>
              </tr>
              <tr className="hover:bg-secondary-800/20">
                <td className="py-3 px-4 text-white">Project Progress</td>
                <td className="py-3 px-4 text-right text-green-400 font-semibold">72%</td>
                <td className="py-3 px-4 text-right text-green-400">↑ 8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
