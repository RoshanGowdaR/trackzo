'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeChart from '@/components/SafeChart'

export default function DashboardCharts() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return <div className="h-80 bg-secondary-800/20 rounded-2xl animate-pulse" />
  }

  const chartOptions: any = {
    chart: {
      type: 'area' as const,
      width: '100%',
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    colors: ['#2563eb', '#06b6d4'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.1)',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: 'dark',
    },
  }

  const series = [
    { name: 'Completed Projects', data: [2, 4, 5, 8, 10, 12] },
    { name: 'Ongoing Projects', data: [5, 7, 8, 10, 12, 15] },
  ]

  const barChartOptions: any = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    colors: ['#22c55e', '#f59e0b'],
    xaxis: {
      categories: ['Material', 'Labour', 'Equipment'],
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
        },
      },
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.1)',
    },
    tooltip: {
      theme: 'dark',
    },
  }

  const barSeries = [
    { name: 'Budget (₹)', data: [120000, 80000, 40000] },
    { name: 'Spent (₹)', data: [85000, 50000, 25000] },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 card"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Project Performance</h2>
          <p className="text-secondary-400 text-sm">Monthly project completion and progress</p>
        </div>
        <SafeChart options={chartOptions} series={series} type="area" height={300} />
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Project Status</h2>
          <p className="text-secondary-400 text-sm">Distribution of projects</p>
        </div>
        <SafeChart
          options={{
            chart: {
              type: 'donut',
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            colors: ['#22c55e', '#f59e0b', '#ef4444', '#06b6d4'],
            labels: ['Completed', 'Running', 'Delayed', 'Upcoming'],
            legend: {
              labels: {
                colors: '#94a3b8',
              },
              position: 'bottom',
            },
            tooltip: {
              theme: 'dark',
            },
          }}
          series={[4, 3, 1, 2]}
          type="donut"
          height={250}
        />
      </motion.div>

      {/* Expenses Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2 card"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Expense Breakdown</h2>
          <p className="text-secondary-400 text-sm">Cost distribution by category</p>
        </div>
        <SafeChart options={barChartOptions} series={barSeries} type="bar" height={300} />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary-800/40 border border-white/5">
              <span className="text-secondary-400 text-sm">Active Projects</span>
              <span className="text-white font-bold">10</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary-800/40 border border-white/5">
              <span className="text-secondary-400 text-sm">Avg Completion</span>
              <span className="text-green-400 font-bold">78%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary-800/40 border border-white/5">
              <span className="text-secondary-400 text-sm">Budget Utilization</span>
              <span className="text-primary-400 font-bold">64%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
