'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Plus, X, BarChart3, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import SafeChart from '@/components/SafeChart'

interface CompletedProject {
  id: number
  name: string
  budget: number
  actualCost: number
  area: number
  duration: number
  materials: { category: string; cost: number }[]
  labour: number
  equipment: number
}

interface EstimationData {
  projectName: string
  area: number
  floors: number
  type: string
}

export default function EstimationAnalytics({ projectId }: { projectId: number }) {
  const [completedProjects] = useState<CompletedProject[]>([
    {
      id: 1,
      name: 'Project A - 3 Storey Building',
      budget: 500000,
      actualCost: 480000,
      area: 5000,
      duration: 120,
      materials: [
        { category: 'Cement & Concrete', cost: 120000 },
        { category: 'Steel & Iron', cost: 95000 },
        { category: 'Bricks & Blocks', cost: 85000 },
        { category: 'Electrical', cost: 65000 },
        { category: 'Plumbing', cost: 55000 },
        { category: 'Finishing', cost: 60000 },
      ],
      labour: 100000,
      equipment: 80000,
    },
    {
      id: 2,
      name: 'Project B - 2 Storey Building',
      budget: 380000,
      actualCost: 375000,
      area: 3500,
      duration: 90,
      materials: [
        { category: 'Cement & Concrete', cost: 85000 },
        { category: 'Steel & Iron', cost: 70000 },
        { category: 'Bricks & Blocks', cost: 60000 },
        { category: 'Electrical', cost: 45000 },
        { category: 'Plumbing', cost: 40000 },
        { category: 'Finishing', cost: 35000 },
      ],
      labour: 75000,
      equipment: 55000,
    },
    {
      id: 3,
      name: 'Project C - 4 Storey Building',
      budget: 650000,
      actualCost: 620000,
      area: 6500,
      duration: 150,
      materials: [
        { category: 'Cement & Concrete', cost: 155000 },
        { category: 'Steel & Iron', cost: 120000 },
        { category: 'Bricks & Blocks', cost: 110000 },
        { category: 'Electrical', cost: 85000 },
        { category: 'Plumbing', cost: 75000 },
        { category: 'Finishing', cost: 75000 },
      ],
      labour: 130000,
      equipment: 100000,
    },
  ])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const [showEstimationModal, setShowEstimationModal] = useState(false)
  const [estimationData, setEstimationData] = useState<any>({
    projectName: '',
    area: '',
    floors: '',
    type: 'Residential',
  })
  const [estimationResult, setEstimationResult] = useState<any>(null)

  // Calculate analytics
  const totalProjects = completedProjects.length
  const avgBudget = Math.round(completedProjects.reduce((sum, p) => sum + p.budget, 0) / totalProjects)
  const avgActualCost = Math.round(completedProjects.reduce((sum, p) => sum + p.actualCost, 0) / totalProjects)
  const avgCostPerSqft = Math.round(completedProjects.reduce((sum, p) => sum + p.actualCost / p.area, 0) / totalProjects)
  const avgDuration = Math.round(completedProjects.reduce((sum, p) => sum + p.duration, 0) / totalProjects)
  const avgLabourCost = Math.round(completedProjects.reduce((sum, p) => sum + p.labour, 0) / totalProjects)
  const avgEquipmentCost = Math.round(completedProjects.reduce((sum, p) => sum + p.equipment, 0) / totalProjects)

  const costBreakdown = [
    {
      name: 'Materials',
      value: Math.round(
        completedProjects.reduce((sum, p) => sum + p.materials.reduce((m, c) => m + c.cost, 0), 0) / totalProjects
      ),
    },
    { name: 'Labour', value: avgLabourCost },
    { name: 'Equipment', value: avgEquipmentCost },
  ]

  const costTrendData = completedProjects.map((p) => ({
    name: p.name.split(' - ')[0],
    budget: p.budget,
    actual: p.actualCost,
  }))

  const performanceData = completedProjects.map((p) => ({
    name: p.name.split(' - ')[0],
    accuracy: Math.round((p.actualCost / p.budget) * 100),
  }))

  // ApexCharts configurations
  const pieChartOptions: any = {
    chart: { type: 'pie' as const },
    labels: costBreakdown.map(item => item.name),
    colors: ['#2563EB', '#06B6D4', '#22C55E'],
    legend: { position: 'bottom' as const },
    plotOptions: {
      pie: {
        dataLabels: {
          formatter: (val: any) => `${val.toFixed(0)}%`
        }
      }
    }
  }

  const barChartOptions: any = {
    chart: { type: 'bar' as const, toolbar: { show: false } },
    colors: ['#2563EB', '#06B6D4'],
    xaxis: { categories: costTrendData.map(d => d.name) },
    yaxis: { title: { text: 'Amount (₹)' } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%' }
    },
    dataLabels: { enabled: false }
  }

  const lineChartOptions: any = {
    chart: { type: 'line' as const, toolbar: { show: false } },
    colors: ['#22C55E'],
    xaxis: { categories: performanceData.map(d => d.name) },
    yaxis: { title: { text: 'Accuracy %' } },
    stroke: { curve: 'smooth' as const, width: 3 },
    dataLabels: { enabled: false }
  }

  const handleEstimate = () => {
    if (!estimationData.projectName || !estimationData.area || !estimationData.floors) {
      alert('⚠️ Please fill all fields')
      return
    }

    const area = parseFloat(estimationData.area as any)
    const floors = parseInt(estimationData.floors as any)

    // Calculate estimation based on averages
    const estimatedCostPerSqft = avgCostPerSqft * (floors / 3) // Adjust for number of floors
    const estimatedTotalCost = Math.round(area * estimatedCostPerSqft)
    const estimatedDuration = Math.round(avgDuration * (area / 5000))

    // Cost breakdown
    const materialsPercentage = 0.45
    const labourPercentage = 0.25
    const equipmentPercentage = 0.15
    const otherPercentage = 0.15

    const estimatedMaterials = Math.round(estimatedTotalCost * materialsPercentage)
    const estimatedLabour = Math.round(estimatedTotalCost * labourPercentage)
    const estimatedEquipment = Math.round(estimatedTotalCost * equipmentPercentage)
    const estimatedOther = Math.round(estimatedTotalCost * otherPercentage)

    setEstimationResult({
      projectName: estimationData.projectName,
      area,
      floors,
      type: estimationData.type,
      estimatedTotalCost,
      estimatedDuration,
      costPerSqft: Math.round(estimatedCostPerSqft),
      breakdown: [
        { category: 'Materials', value: estimatedMaterials, percentage: 45 },
        { category: 'Labour', value: estimatedLabour, percentage: 25 },
        { category: 'Equipment', value: estimatedEquipment, percentage: 15 },
        { category: 'Other', value: estimatedOther, percentage: 15 },
      ],
      confidence: 92,
    })
  }

  if (!mounted) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Estimation Analytics</h2>
          <p className="text-secondary-400">Analyze completed projects and estimate new ones</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowEstimationModal(true)}
          className="btn-primary flex items-center gap-2 rounded-lg px-6 py-3"
        >
          <Plus className="w-5 h-5" />
          Estimate New Project
        </motion.button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Budget', value: `₹${avgBudget.toLocaleString()}`, color: 'from-blue-600' },
          { label: 'Avg Actual Cost', value: `₹${avgActualCost.toLocaleString()}`, color: 'from-cyan-600' },
          { label: 'Cost per Sq.ft', value: `₹${avgCostPerSqft}`, color: 'from-green-600' },
          { label: 'Avg Duration', value: `${avgDuration} days`, color: 'from-purple-600' },
        ].map((item, idx) => (
          <motion.div key={idx} className={`card bg-gradient-to-br ${item.color} bg-opacity-10`}>
            <p className="text-secondary-400 text-sm mb-2">{item.label}</p>
            <p className="text-2xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Cost Breakdown Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="card">
          <h3 className="text-xl font-bold text-white mb-6">Average Cost Breakdown</h3>
          <SafeChart
            type="pie"
            options={pieChartOptions}
            series={costBreakdown.map(item => item.value)}
            height={300}
          />
        </motion.div>

        <motion.div className="card">
          <h3 className="text-xl font-bold text-white mb-6">Budget vs Actual Cost</h3>
          <SafeChart
            type="bar"
            options={barChartOptions}
            series={[
              { name: 'Budget', data: costTrendData.map(d => d.budget) },
              { name: 'Actual', data: costTrendData.map(d => d.actual) }
            ]}
            height={300}
          />
        </motion.div>
      </div>

      {/* Performance Accuracy */}
      <motion.div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Estimation Accuracy</h3>
        <SafeChart
          type="line"
          options={lineChartOptions}
          series={[{ name: 'Accuracy %', data: performanceData.map(d => d.accuracy) }]}
          height={300}
        />
      </motion.div>

      {/* Completed Projects Table */}
      <motion.div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Completed Projects Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Project Name</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Area (Sq.ft)</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Budget</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Actual Cost</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Duration (Days)</th>
                <th className="text-left py-4 px-6 font-semibold text-secondary-300">Cost/Sq.ft</th>
              </tr>
            </thead>
            <tbody>
              {completedProjects.map((project) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-secondary-800/30">
                  <td className="py-4 px-6 font-semibold text-white">{project.name}</td>
                  <td className="py-4 px-6 text-secondary-400">{project.area.toLocaleString()}</td>
                  <td className="py-4 px-6 text-primary-400">₹{project.budget.toLocaleString()}</td>
                  <td className="py-4 px-6 text-accent-400">₹{project.actualCost.toLocaleString()}</td>
                  <td className="py-4 px-6 text-secondary-400">{project.duration}</td>
                  <td className="py-4 px-6 text-green-400">₹{Math.round(project.actualCost / project.area)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Estimation Modal */}
      <AnimatePresence>
        {showEstimationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEstimationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => {
                  setShowEstimationModal(false)
                  setEstimationResult(null)
                }}
                className="absolute top-4 right-4 text-secondary-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {!estimationResult ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6">Estimate New Project</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-secondary-300 mb-2">Project Name *</label>
                      <input
                        type="text"
                        value={estimationData.projectName}
                        onChange={(e) => setEstimationData({ ...estimationData, projectName: e.target.value })}
                        placeholder="e.g., New Commercial Complex"
                        className="w-full glass-sm rounded-lg px-4 py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-secondary-300 mb-2">Total Area (Sq.ft) *</label>
                        <input
                          type="number"
                          value={estimationData.area}
                          onChange={(e) => setEstimationData({ ...estimationData, area: e.target.value })}
                          placeholder="5000"
                          className="w-full glass-sm rounded-lg px-4 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-secondary-300 mb-2">Number of Floors *</label>
                        <input
                          type="number"
                          value={estimationData.floors}
                          onChange={(e) => setEstimationData({ ...estimationData, floors: e.target.value })}
                          placeholder="3"
                          className="w-full glass-sm rounded-lg px-4 py-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-secondary-300 mb-2">Project Type</label>
                      <select
                        value={estimationData.type}
                        onChange={(e) => setEstimationData({ ...estimationData, type: e.target.value })}
                        className="w-full glass-sm rounded-lg px-4 py-2"
                      >
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowEstimationModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-secondary-700 text-secondary-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleEstimate}
                      className="flex-1 btn-primary rounded-lg flex items-center justify-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Generate Estimate
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Estimation Report</h3>
                  <p className="text-secondary-400 mb-6">Based on analysis of {totalProjects} completed projects</p>

                  <div className="space-y-6">
                    {/* Project Details */}
                    <div className="bg-secondary-800/30 rounded-lg p-4">
                      <h4 className="text-lg font-bold text-white mb-3">{estimationResult.projectName}</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-secondary-400">Area</p>
                          <p className="text-white font-semibold">{estimationResult.area.toLocaleString()} Sq.ft</p>
                        </div>
                        <div>
                          <p className="text-secondary-400">Floors</p>
                          <p className="text-white font-semibold">{estimationResult.floors}</p>
                        </div>
                        <div>
                          <p className="text-secondary-400">Project Type</p>
                          <p className="text-white font-semibold">{estimationResult.type}</p>
                        </div>
                        <div>
                          <p className="text-secondary-400">Confidence</p>
                          <p className="text-green-400 font-semibold">{estimationResult.confidence}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Estimation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="card bg-gradient-to-br from-primary-600 bg-opacity-10">
                        <p className="text-secondary-400 text-sm mb-2">Estimated Total Cost</p>
                        <p className="text-3xl font-bold text-primary-400">₹{estimationResult.estimatedTotalCost.toLocaleString()}</p>
                        <p className="text-xs text-secondary-400 mt-2">₹{estimationResult.costPerSqft}/Sq.ft</p>
                      </div>

                      <div className="card bg-gradient-to-br from-accent-600 bg-opacity-10">
                        <p className="text-secondary-400 text-sm mb-2">Estimated Duration</p>
                        <p className="text-3xl font-bold text-accent-400">{estimationResult.estimatedDuration}</p>
                        <p className="text-xs text-secondary-400 mt-2">Days</p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div>
                      <h4 className="font-bold text-white mb-4">Cost Breakdown</h4>
                      <div className="space-y-2">
                        {estimationResult.breakdown.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-secondary-800/30 rounded-lg">
                            <div>
                              <p className="text-white font-semibold">{item.category}</p>
                              <p className="text-xs text-secondary-400">{item.percentage}% of total</p>
                            </div>
                            <p className="text-primary-400 font-bold">₹{item.value.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setEstimationResult(null)}
                        className="flex-1 px-4 py-2 rounded-lg border border-secondary-700 text-secondary-300 hover:text-white transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          alert(`✅ Estimation saved for ${estimationResult.projectName}`)
                          setShowEstimationModal(false)
                          setEstimationResult(null)
                        }}
                        className="flex-1 btn-primary rounded-lg"
                      >
                        Save Estimation
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
