'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/layouts/DashboardLayout'
import EnterpriseKPICards from '@/components/dashboard/EnterpriseKPICards'
import ProjectCard from '@/components/account-tracker/ProjectCard'
import DataTable from '@/components/account-tracker/DataTable'
import ActivityTimeline from '@/components/account-tracker/ActivityTimeline'
import { Plus, X, Send, CheckCircle, FileText, Users, Wallet, BarChart3, TrendingUp } from 'lucide-react'
import SafeChart from '@/components/SafeChart'
import { formatCurrency, formatDate } from '@/utils/construction'
import type { Project } from '@/types/construction'

export default function EnhancedAccountTrackerPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    description: '',
  })

  // Sample KPI Data
  const kpiData = {
    totalProjects: 24,
    completedProjects: 10,
    ongoingProjects: 9,
    totalRevenue: 12500000,
    totalExpense: 8125000,
    totalPaid: 14500000,
    outstandingBalance: 1750000,
    monthlyProgress: 85,
    profitLoss: 8750000,
    totalClients: 15,
    businessHealth: 'Excellent',
  }

  // Sample Projects
  const projects: Project[] = [
    { id: '1', name: 'AK Villa Project', client: 'Mr. Sharma', type: 'Residential', status: 'Completed', startDate: '2026-05-01', endDate: '2026-06-12', budget: 500000, revenue: 500000, expense: 350000, progress: 100, location: 'Mumbai', description: '', image: '🏠', createdAt: '2026-05-01', updatedAt: '2026-06-12' },
    { id: '2', name: 'Interior Design Work', client: 'Mr. Kumar', type: 'Interior', status: 'In Progress', startDate: '2026-06-01', endDate: '2026-07-31', budget: 300000, revenue: 250000, expense: 150000, progress: 65, location: 'Delhi', description: '', image: '🎨', createdAt: '2026-06-01', updatedAt: '2026-07-15' },
    { id: '3', name: 'Commercial Building', client: 'XYZ Corp', type: 'Commercial', status: 'In Progress', startDate: '2026-04-01', endDate: '2026-12-31', budget: 2000000, revenue: 2200000, expense: 1500000, progress: 45, location: 'Bangalore', description: '', image: '🏢', createdAt: '2026-04-01', updatedAt: '2026-07-20' },
  ]

  // Sample Materials
  const materials = [
    { id: '1', name: 'Cement', category: 'Cement', unit: 'Bag', quantity: 500, unitRate: 500, totalCost: 250000, supplierId: '1', invoiceNumber: 'INV-001', purchaseDate: '2026-07-15', workStage: 'Foundation', paymentStatus: 'Paid', remainingBudget: 100000, createdAt: '2026-07-15', updatedAt: '2026-07-15' },
    { id: '2', name: 'Steel Rebar', category: 'Steel', unit: 'Ton', quantity: 50, unitRate: 50000, totalCost: 2500000, supplierId: '2', invoiceNumber: 'INV-002', purchaseDate: '2026-07-12', workStage: 'Framing', paymentStatus: 'Pending', remainingBudget: 250000, createdAt: '2026-07-12', updatedAt: '2026-07-12' },
    { id: '3', name: 'Bricks', category: 'Bricks', unit: 'Piece', quantity: 10000, unitRate: 8, totalCost: 80000, supplierId: '3', invoiceNumber: 'INV-003', purchaseDate: '2026-07-10', workStage: 'Masonry', paymentStatus: 'Paid', remainingBudget: 50000, createdAt: '2026-07-10', updatedAt: '2026-07-10' },
  ]

  // Sample Activities
  const activities = [
    { id: '1', type: 'payment' as const, title: 'Payment Received', description: '₹50,000 from Mr. Sharma', projectId: '1', timestamp: new Date().toISOString(), icon: '✓', color: 'bg-emerald-500', amount: 50000 },
    { id: '2', type: 'expense' as const, title: 'Material Purchased', description: 'Cement - 500 bags', projectId: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: '📦', color: 'bg-orange-500', amount: 250000 },
    { id: '3', type: 'invoice' as const, title: 'Invoice Created', description: 'Invoice for XYZ Corp', projectId: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: '📄', color: 'bg-blue-500', amount: 500000 },
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(`✓ ${activeModal === 'addClient' ? 'Client' : activeModal === 'createInvoice' ? 'Invoice' : 'Project'} created successfully!`)
    setFormData({ name: '', email: '', phone: '', amount: '', description: '' })
    setTimeout(() => {
      setActiveModal(null)
      setSuccessMessage('')
    }, 2000)
  }

  // Tab Buttons
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: TrendingUp },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: FileText },
  ]

  const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <AnimatePresence>
      {activeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-secondary-900 to-secondary-950 border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-400" />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg z-40"
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Construction Management</h1>
            <p className="text-secondary-400">Enterprise dashboard for project tracking</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal('addProject')}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </motion.button>
        </motion.div>

        {/* Enterprise KPI Cards */}
        <EnterpriseKPICards kpis={kpiData} />

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-secondary-800/50 text-secondary-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-bold text-white mb-6">Project Status Distribution</h3>
                  <SafeChart
                    options={{
                      chart: { type: 'donut' as const, toolbar: { show: false } },
                      colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
                      labels: ['Completed', 'In Progress', 'On Hold', 'Planned'],
                      tooltip: { theme: 'dark' as const },
                      legend: { position: 'bottom' as const },
                    }}
                    series={[10, 9, 3, 2]}
                    type="donut"
                    height={300}
                  />
                </motion.div>

                {/* Activity Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-bold text-white mb-6">Recent Activities</h3>
                  <ActivityTimeline activities={activities} limit={5} />
                </motion.div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={() => setSuccessMessage(`✓ Opened: ${project.name}`)}
                      onArchive={() => setSuccessMessage(`✓ Archived: ${project.name}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Material Inventory</h3>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <DataTable
                    columns={[
                      { key: 'name', label: 'Material', sortable: true },
                      { key: 'category', label: 'Category' },
                      { key: 'quantity', label: 'Quantity', sortable: true, render: (v, r) => `${v} ${r.unit}` },
                      { key: 'unitRate', label: 'Rate', render: (v) => formatCurrency(v) },
                      { key: 'totalCost', label: 'Total Cost', sortable: true, render: (v) => formatCurrency(v) },
                      { key: 'paymentStatus', label: 'Status' },
                    ]}
                    data={materials}
                  />
                </motion.div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Invoices</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveModal('createInvoice')}
                    className="bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Create Invoice
                  </motion.button>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <DataTable
                    columns={[
                      { key: 'invoiceNumber', label: 'Invoice #' },
                      { key: 'totalAmount', label: 'Amount', render: (v) => formatCurrency(v) },
                      { key: 'status', label: 'Status' },
                    ]}
                    data={[
                      { invoiceNumber: 'INV-001', totalAmount: 550000, status: 'Paid' },
                      { invoiceNumber: 'INV-002', totalAmount: 330000, status: 'Pending' },
                    ]}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add Project Modal */}
        <Modal title="Add New Project">
          {activeModal === 'addProject' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500"
              />
              <input
                type="text"
                placeholder="Client Name"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500"
              />
              <input
                type="number"
                placeholder="Budget (₹)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Create Project
              </button>
            </form>
          )}
        </Modal>

        {/* Create Invoice Modal */}
        <Modal title="Create Invoice">
          {activeModal === 'createInvoice' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Invoice Number"
                className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Create Invoice
              </button>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
