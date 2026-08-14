'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SafeChart from '@/components/SafeChart'
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react'

interface AdvancedAnalyticsProps {
  data: {
    totalSpending: number
    budgetUtilization: number
    cashFlowTrend: number[]
    costByCategory: Record<string, number>
    monthlyTrend: number[]
    expenseBreakdown: Record<string, number>
  }
  period?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
}

export default function AdvancedAnalytics({ data, period = 'monthly' }: AdvancedAnalyticsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Budget Utilization Chart
  const budgetChartOptions = {
    chart: { type: 'radialBar' as const, toolbar: { show: false } },
    colors: ['#3B82F6'],
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: false },
          value: { color: '#fff', fontSize: '16px', fontWeight: 'bold' },
        },
      },
    },
    labels: ['Budget Used'],
    states: { hover: { filter: { type: 'none' } } },
  }

  const budgetChartSeries = [data.budgetUtilization]

  // Cost Breakdown Pie Chart
  const costBreakdownOptions = {
    chart: { type: 'donut' as const, toolbar: { show: false } },
    colors: ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'],
    labels: Object.keys(data.expenseBreakdown),
    tooltip: { theme: 'dark' as const },
    legend: { position: 'bottom' as const, fontSize: '12' },
  }

  const costBreakdownSeries = Object.values(data.expenseBreakdown)

  // Monthly Trend
  const monthlyTrendOptions = {
    chart: { type: 'area' as const, toolbar: { show: false } },
    colors: ['#10B981'],
    stroke: { curve: 'smooth' as const, width: 2 },
    fill: { type: 'gradient' as const },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' as const },
    grid: { show: false },
  }

  const monthlyTrendSeries = [{ name: 'Spending', data: data.monthlyTrend }]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Advanced Analytics
            </h2>
            <p className="text-secondary-400 text-sm mt-1">
              Detailed insights and trends ({period})
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/5 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <p className="text-xs font-semibold text-secondary-400">Total Spending</p>
          </div>
          <p className="text-2xl font-bold text-white">₹{(data.totalSpending / 100000).toFixed(1)}L</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-400/5 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <p className="text-xs font-semibold text-secondary-400">Budget Usage</p>
          </div>
          <p className="text-2xl font-bold text-white">{data.budgetUtilization}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/10 to-purple-400/5 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-5 h-5 text-purple-400" />
            <p className="text-xs font-semibold text-secondary-400">Cash Flow</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {data.cashFlowTrend[data.cashFlowTrend.length - 1] > 0 ? '+' : ''}
            {data.cashFlowTrend[data.cashFlowTrend.length - 1]}%
          </p>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Utilization Radial */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-6">Budget Utilization</h3>
          <SafeChart
            options={budgetChartOptions}
            series={budgetChartSeries}
            type="radialBar"
            height={280}
          />
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-6">Expense Breakdown</h3>
          <SafeChart
            options={costBreakdownOptions}
            series={costBreakdownSeries}
            type="donut"
            height={280}
          />
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-6">Spending Trend</h3>
        <SafeChart
          options={monthlyTrendOptions}
          series={monthlyTrendSeries}
          type="area"
          height={300}
        />
      </motion.div>

      {/* Insights */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-secondary-800/30 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-secondary-400 mb-2">Highest Expense</p>
          <p className="text-lg font-bold text-orange-400">Materials</p>
          <p className="text-xs text-secondary-500 mt-1">45% of total</p>
        </div>

        <div className="bg-secondary-800/30 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-secondary-400 mb-2">Trend Direction</p>
          <p className="text-lg font-bold text-emerald-400">Stable</p>
          <p className="text-xs text-secondary-500 mt-1">Consistent month-over-month</p>
        </div>

        <div className="bg-secondary-800/30 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-secondary-400 mb-2">Budget Status</p>
          <p className="text-lg font-bold text-blue-400">On Track</p>
          <p className="text-xs text-secondary-500 mt-1">15% buffer remaining</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
