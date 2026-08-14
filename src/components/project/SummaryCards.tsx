'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react'
import SafeChart from '@/components/SafeChart'

interface SummaryCardProps {
  projectId: number
}

const SummaryCard = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className={`card bg-gradient-to-br ${color} bg-opacity-10 border border-white/10`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs text-secondary-400">Monthly</span>
    </div>
    <p className="text-secondary-400 text-sm mb-2">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </motion.div>
)

export default function SummaryCards({ projectId }: SummaryCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const [chartData, setChartData] = useState({
    progress: 65,
    budget: 250000,
    spent: 162500,
    material_cost: 85000,
    labour_cost: 50000,
    profit: 37500,
  })

  if (!mounted) {
    return <div className="h-80 bg-secondary-800/20 rounded-2xl animate-pulse" />
  }

  // Charts data
  const progressChartOptions: any = {
    chart: { type: 'radialBar', width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, background: 'transparent' },
    colors: ['#2563eb'],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '16px' },
        },
      },
    },
    labels: ['Progress'],
    tooltip: { theme: 'dark' },
  }

  const expenseChartOptions: any = {
    chart: { type: 'donut', width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, background: 'transparent', toolbar: { show: false } },
    colors: ['#22c55e', '#f59e0b', '#ef4444'],
    labels: ['Material Cost', 'Labour Cost', 'Other Costs'],
    legend: { labels: { colors: '#94a3b8' }, position: 'bottom' as const },
    tooltip: { theme: 'dark' },
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Project Overview</h1>
        <p className="text-secondary-400">Construction Project Management Dashboard</p>
      </motion.div>

      {/* Summary Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <SummaryCard
          icon={DollarSign}
          label="Total Budget"
          value={`₹${(chartData.budget / 100000).toFixed(1)}L`}
          color="from-primary-600 to-primary-400"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total Expenses"
          value={`₹${(chartData.spent / 100000).toFixed(1)}L`}
          color="from-orange-600 to-orange-400"
        />
        <SummaryCard
          icon={Package}
          label="Material Cost"
          value={`₹${(chartData.material_cost / 100000).toFixed(1)}L`}
          color="from-accent-600 to-accent-400"
        />
        <SummaryCard
          icon={Users}
          label="Labour Cost"
          value={`₹${(chartData.labour_cost / 100000).toFixed(1)}L`}
          color="from-purple-600 to-purple-400"
        />
        <SummaryCard
          icon={DollarSign}
          label="Remaining Budget"
          value={`₹${((chartData.budget - chartData.spent) / 100000).toFixed(1)}L`}
          color="from-green-600 to-green-400"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Progress"
          value={`${chartData.progress}%`}
          color="from-blue-600 to-blue-400"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Progress Chart */}
        <motion.div className="card lg:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6">Project Progress</h3>
          <SafeChart
            options={progressChartOptions}
            series={[chartData.progress]}
            type="radialBar"
            height={300}
          />
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div className="card lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6">Expense Breakdown</h3>
          {(() => {
            const rawDonutSeries = [
              chartData.material_cost || 0,
              chartData.labour_cost || 0,
              Math.max(0, chartData.spent - chartData.material_cost - chartData.labour_cost) || 0,
            ]
            const sumDonut = rawDonutSeries.reduce((a, b) => a + b, 0)
            const donutSeries = sumDonut > 0 ? rawDonutSeries : [50000, 30000, 20000]
            return (
              <SafeChart
                options={expenseChartOptions}
                series={donutSeries}
                type="donut"
                height={300}
              />
            )
          })()}
        </motion.div>
      </motion.div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-xl font-bold text-white mb-6">Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-400 text-sm mb-2">Total Budget</p>
            <p className="text-2xl font-bold text-white">${(chartData.budget / 1000).toFixed(0)}K</p>
            <p className="text-xs text-secondary-400 mt-2">Allocated funds</p>
          </div>
          <div className="p-4 bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-400 text-sm mb-2">Spent</p>
            <p className="text-2xl font-bold text-orange-400">${(chartData.spent / 1000).toFixed(0)}K</p>
            <p className="text-xs text-secondary-400 mt-2">Used ({((chartData.spent / chartData.budget) * 100).toFixed(0)}%)</p>
          </div>
          <div className="p-4 bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-400 text-sm mb-2">Remaining</p>
            <p className="text-2xl font-bold text-green-400">${((chartData.budget - chartData.spent) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-secondary-400 mt-2">Available</p>
          </div>
          <div className="p-4 bg-secondary-800/50 rounded-lg">
            <p className="text-secondary-400 text-sm mb-2">Balance</p>
            <p className={`text-2xl font-bold ${chartData.budget >= chartData.spent ? 'text-green-400' : 'text-red-400'}`}>
              ${((chartData.budget - chartData.spent) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-secondary-400 mt-2">Status</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
