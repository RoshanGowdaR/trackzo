'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/layouts/DashboardLayout'
import { Plus, Trophy, Award, TrendingUp, Folder, Download, ChevronRight, Users, FileText, BarChart3, Wallet, ArrowUpRight, Target, X, Send, CheckCircle } from 'lucide-react'
import SafeChart from '@/components/SafeChart'
import { useProjectStore } from '@/store/useProjectStore'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

interface ModalType {
  type: 'addClient' | 'createInvoice' | 'viewReports' | 'expenses' | 'addProject' | null
}

export default function AccountTrackerPage() {
  const projects = useProjectStore((state) => state.projects)
  const loadFromStorage = useProjectStore((state) => state.loadFromStorage)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<any>(null)

  useEffect(() => {
    // Load from storage on mount
    loadFromStorage()
    setIsLoaded(true)
  }, [])

  const [activeModal, setActiveModal] = useState<ModalType['type']>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    description: '',
  })

  // Download functions
  const downloadPDF = (project: any) => {
    try {
      const pdf = new jsPDF()
      let yPosition = 10

      // Title
      pdf.setFontSize(20)
      pdf.text('PROJECT DETAILS REPORT', 10, yPosition)
      yPosition += 15

      // Project Name
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${project.name}`, 10, yPosition)
      yPosition += 8

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text(`${project.description || 'Construction Project'}`, 10, yPosition)
      yPosition += 12

      // Client Info
      pdf.setFont('helvetica', 'bold')
      pdf.text('CLIENT INFORMATION', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Client: ${project.client_name}`, 10, yPosition)
      yPosition += 5
      pdf.text(`Email: ${project.client_email || 'N/A'}`, 10, yPosition)
      yPosition += 5
      pdf.text(`Phone: ${project.ownerPhone}`, 10, yPosition)
      yPosition += 12

      // Owner Info
      pdf.setFont('helvetica', 'bold')
      pdf.text('OWNER DETAILS', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Owner: ${project.owner}`, 10, yPosition)
      yPosition += 5
      pdf.text(`Phone: ${project.ownerPhone}`, 10, yPosition)
      yPosition += 12

      // Address
      pdf.setFont('helvetica', 'bold')
      pdf.text('SITE ADDRESS', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(project.address, 10, yPosition, { maxWidth: 190 })
      yPosition += 15

      // Measurements
      pdf.setFont('helvetica', 'bold')
      pdf.text('PROPERTY MEASUREMENTS', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Length: ${project.length}m | Width: ${project.width}m | Area: ${project.area}m² | Square Feet: ${Math.round(project.area * 10.764)}`, 10, yPosition, { maxWidth: 190 })
      yPosition += 12

      // Status
      pdf.setFont('helvetica', 'bold')
      pdf.text('PROJECT STATUS', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Status: ${project.status.toUpperCase()} | Progress: ${project.progress}%`, 10, yPosition)
      yPosition += 5
      pdf.text(`Start: ${project.startDate || 'N/A'} | End: ${project.endDate || 'N/A'}`, 10, yPosition)
      yPosition += 12

      // Financial Details
      pdf.setFont('helvetica', 'bold')
      pdf.text('FINANCIAL DETAILS', 10, yPosition)
      yPosition += 6
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Total Budget: ₹${(project.budget / 100000).toFixed(1)}L`, 10, yPosition)
      yPosition += 5
      pdf.text(`Expenses: ₹${(project.expenses / 100000).toFixed(1)}L`, 10, yPosition)
      yPosition += 5
      pdf.text(`Material Cost: ₹${(project.materialCost / 100000).toFixed(1)}L`, 10, yPosition)
      yPosition += 5
      pdf.text(`Labour Cost: ₹${(project.labourCost / 100000).toFixed(1)}L`, 10, yPosition)
      yPosition += 5
      pdf.text(`Remaining Budget: ₹${((project.budget - project.expenses) / 100000).toFixed(1)}L`, 10, yPosition)
      yPosition += 12

      // Materials
      if (project.materials && project.materials.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text(`MATERIALS (${project.materials.length})`, 10, yPosition)
        yPosition += 6
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)

        project.materials.forEach((material: any) => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 10
          }
          pdf.text(`${material.name}`, 10, yPosition)
          yPosition += 4
          pdf.text(`Qty: ${material.quantity} ${material.unit} | Used: ${material.used} | Remaining: ${material.quantity - material.used} | Cost: ₹${(material.cost / 1000).toFixed(0)}K`, 12, yPosition)
          yPosition += 4
          pdf.text(`Supplier: ${material.supplier} | Date: ${material.purchaseDate}`, 12, yPosition)
          yPosition += 8
        })
      }

      pdf.save(`${project.name}-Report.pdf`)
      setSuccessMessage(`✓ Downloaded PDF: ${project.name}-Report.pdf`)
      setTimeout(() => setSuccessMessage(''), 2000)
    } catch (error) {
      console.error('Error generating PDF:', error)
      setSuccessMessage('❌ Error generating PDF')
      setTimeout(() => setSuccessMessage(''), 2000)
    }
  }

  const downloadExcel = (project: any) => {
    try {
      const wb = XLSX.utils.book_new()

      // Sheet 1: Project Summary
      const summaryData = [
        ['Project Details Report'],
        [],
        ['Project Name', project.name],
        ['Description', project.description || 'Construction Project'],
        [],
        ['CLIENT INFORMATION'],
        ['Client Name', project.client_name],
        ['Email', project.client_email || 'N/A'],
        ['Phone', project.ownerPhone],
        [],
        ['OWNER DETAILS'],
        ['Owner Name', project.owner],
        ['Phone', project.ownerPhone],
        [],
        ['SITE ADDRESS'],
        ['Address', project.address],
        [],
        ['PROPERTY MEASUREMENTS'],
        ['Length (m)', project.length],
        ['Width (m)', project.width],
        ['Area (m²)', project.area],
        ['Square Feet', Math.round(project.area * 10.764)],
        [],
        ['PROJECT STATUS'],
        ['Status', project.status.toUpperCase()],
        ['Progress (%)', project.progress],
        ['Start Date', project.startDate || 'N/A'],
        ['End Date', project.endDate || 'N/A'],
        [],
        ['FINANCIAL DETAILS'],
        ['Total Budget (₹)', project.budget],
        ['Expenses (₹)', project.expenses],
        ['Material Cost (₹)', project.materialCost],
        ['Labour Cost (₹)', project.labourCost],
        ['Remaining Budget (₹)', project.budget - project.expenses],
      ]

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 35 }]
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')

      // Sheet 2: Materials
      if (project.materials && project.materials.length > 0) {
        const materialsData = [
          ['Name', 'Quantity', 'Unit', 'Used', 'Remaining', 'Cost (₹)', 'Supplier', 'Purchase Date'],
          ...project.materials.map((m: any) => [
            m.name,
            m.quantity,
            m.unit,
            m.used,
            m.quantity - m.used,
            m.cost,
            m.supplier,
            m.purchaseDate,
          ]),
        ]

        const materialsWs = XLSX.utils.aoa_to_sheet(materialsData)
        materialsWs['!cols'] = [
          { wch: 20 },
          { wch: 12 },
          { wch: 10 },
          { wch: 10 },
          { wch: 12 },
          { wch: 15 },
          { wch: 20 },
          { wch: 15 },
        ]
        XLSX.utils.book_append_sheet(wb, materialsWs, 'Materials')
      }

      XLSX.writeFile(wb, `${project.name}-Report.xlsx`)
      setSuccessMessage(`✓ Downloaded Excel: ${project.name}-Report.xlsx`)
      setTimeout(() => setSuccessMessage(''), 2000)
    } catch (error) {
      console.error('Error generating Excel:', error)
      setSuccessMessage('❌ Error generating Excel')
      setTimeout(() => setSuccessMessage(''), 2000)
    }
  }

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalExpenses = projects.reduce((sum, p) => sum + p.expenses, 0)
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const runningProjects = projects.filter(p => p.status === 'running').length

  const stats = [
    { icon: Trophy, label: 'Total Projects', value: projects.length.toString(), subtext: `${completedProjects} Completed`, change: '+3', gradient: 'from-blue-600 to-blue-400', light: 'bg-blue-600/5', border: 'border-blue-500/20' },
    { icon: TrendingUp, label: 'Total Budget', value: `₹${(totalBudget / 1000000).toFixed(1)}M`, subtext: 'All Projects', change: '+8.2%', gradient: 'from-emerald-600 to-emerald-400', light: 'bg-emerald-600/5', border: 'border-emerald-500/20' },
    { icon: BarChart3, label: 'Total Expenses', value: `₹${(totalExpenses / 1000000).toFixed(1)}M`, subtext: 'All Time', change: '-5%', gradient: 'from-amber-600 to-amber-400', light: 'bg-amber-600/5', border: 'border-amber-500/20' },
    { icon: Target, label: 'Running', value: runningProjects.toString(), subtext: 'In Progress', change: '+2', gradient: 'from-violet-600 to-violet-400', light: 'bg-violet-600/5', border: 'border-violet-500/20' },
  ]

  const projectOverviewOptions = {
    chart: { type: 'donut' as const, toolbar: { show: false } },
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
    labels: ['Completed', 'In Progress', 'On Hold', 'Upcoming'],
    tooltip: { theme: 'dark' as const },
    legend: { position: 'bottom' as const, fontSize: '12' },
    plotOptions: {
      pie: { donut: { size: '70%' } },
    },
    dataLabels: { enabled: false },
  }

  const rawOverviewSeries = [
    projects.filter(p => p.status === 'completed').length,
    projects.filter(p => p.status === 'running').length,
    0,
    projects.filter(p => p.status === 'upcoming').length,
  ]
  const sumOverview = rawOverviewSeries.reduce((a, b) => a + b, 0)
  const projectOverviewSeries = sumOverview > 0 ? rawOverviewSeries : [2, 3, 1, 1]

  const projectsWithStatus = projects.map(p => ({
    id: p.id,
    name: p.name,
    type: p.description || 'Construction',
    status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
    statusColor: p.status === 'completed'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      : p.status === 'running'
      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }))

  const firstProject = projects.length > 0 ? projects[0] : null
  const projectDetails = firstProject ? {
    name: firstProject.name,
    client: firstProject.client_name,
    type: firstProject.description || 'Construction',
    startDate: firstProject.startDate || 'N/A',
    endDate: firstProject.endDate || 'N/A',
    status: firstProject.status.charAt(0).toUpperCase() + firstProject.status.slice(1),
    budget: `₹${(firstProject.budget / 100000).toFixed(1)}L`,
    revenue: `₹${(firstProject.budget / 100000).toFixed(1)}L`,
    progress: firstProject.progress,
  } : {
    name: 'No Project',
    client: 'N/A',
    type: 'N/A',
    startDate: 'N/A',
    endDate: 'N/A',
    status: 'N/A',
    budget: '₹0',
    revenue: '₹0',
    progress: 0,
  }

  const files = [
    { id: 1, name: 'Project Agreement.pdf', type: 'PDF', size: '1.2 MB', date: '12 Jun 2026', icon: '📄' },
    { id: 2, name: 'Project Estimation.docx', type: 'DOCX', size: '2.4 MB', date: '10 Jun 2026', icon: '📝' },
    { id: 3, name: 'Budget Sheet.xlsx', type: 'XLSX', size: '1.6 MB', date: '09 Jun 2026', icon: '📊' },
    { id: 4, name: 'Site Photo.jpg', type: 'JPG', size: '3.8 MB', date: '08 Jun 2026', icon: '🖼️' },
  ]

  const activities = [
    { id: 1, type: 'payment', title: 'Payment Received', description: '₹50,000 from Mr. Sharma', time: '10:15 AM', icon: '✓', color: 'bg-emerald-500' },
    { id: 2, type: 'client', title: 'New Client Added', description: 'Mr. Kumar', time: '09:45 AM', icon: '👤', color: 'bg-blue-500' },
  ]

  const quickActions = [
    { label: 'Add Client', icon: Users, color: 'from-blue-600 to-blue-500', hover: 'hover:shadow-lg hover:shadow-blue-500/30', modal: 'addClient' as const },
    { label: 'Create Invoice', icon: FileText, color: 'from-emerald-600 to-emerald-500', hover: 'hover:shadow-lg hover:shadow-emerald-500/30', modal: 'createInvoice' as const },
    { label: 'View Reports', icon: BarChart3, color: 'from-amber-600 to-amber-500', hover: 'hover:shadow-lg hover:shadow-amber-500/30', modal: 'viewReports' as const },
    { label: 'Expenses', icon: Wallet, color: 'from-violet-600 to-violet-500', hover: 'hover:shadow-lg hover:shadow-violet-500/30', modal: 'expenses' as const },
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(`✓ ${activeModal === 'addClient' ? 'Client' : activeModal === 'createInvoice' ? 'Invoice' : activeModal === 'expenses' ? 'Expense' : 'Report'} created successfully!`)
    setFormData({ name: '', email: '', phone: '', amount: '', description: '' })
    setTimeout(() => {
      setActiveModal(null)
      setSuccessMessage('')
    }, 2000)
  }

  const handleDownload = (fileName: string) => {
    setSuccessMessage(`✓ Downloaded: ${fileName}`)
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  const handleProjectClick = (project: any) => {
    setSelectedProjectForDetails(project)
  }

  const handleViewAll = (section: string) => {
    setSuccessMessage(`✓ Viewing all ${section}`)
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  }

  // Modal Component
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

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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

      <div className="space-y-6 pb-12">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-accent-600/10 to-transparent" />
          <div className="relative backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="hidden md:flex w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 items-center justify-center text-3xl shadow-lg shadow-primary-600/30"
                >
                  🎖️
                </motion.div>
                <div>
                  <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Akshay</span>
                  </motion.h1>
                  <p className="text-secondary-300 text-lg">Here's your account performance summary</p>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className={`${stat.light} ${stat.border} border rounded-2xl backdrop-blur-sm p-6 hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-xs font-semibold">{stat.change}</span>
                  </motion.div>
                </div>
                <p suppressHydrationWarning className="text-secondary-400 text-xs font-medium tracking-wide mb-3">{stat.label}</p>
                <p suppressHydrationWarning className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p suppressHydrationWarning className="text-sm text-secondary-400">{stat.subtext}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Primary CTA Button */}
        <motion.button
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveModal('addProject')}
          className="w-full bg-gradient-to-r from-primary-600 via-primary-600 to-accent-600 hover:from-primary-700 hover:via-primary-700 hover:to-accent-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary-600/50 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          Add New Project / Achievement
        </motion.button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Overview */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Project Overview</h2>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={() => handleViewAll('projects')}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
              <SafeChart
                options={projectOverviewOptions}
                series={projectOverviewSeries}
                type="donut"
                height={280}
              />
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Latest Activities</h2>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={() => handleViewAll('activities')}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{activity.title}</p>
                      <p className="text-xs text-secondary-400 truncate">{activity.description}</p>
                      <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Project Details */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Featured Project</h2>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={() => handleViewAll('project details')}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Project Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="md:col-span-1 relative overflow-hidden rounded-2xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400" />
                  <div className="relative aspect-square flex items-center justify-center text-8xl">
                    🏠
                  </div>
                </motion.div>

                {/* Project Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{projectDetails.name}</h3>
                    <p className="text-secondary-400 font-medium">{projectDetails.type} Project</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Client', value: projectDetails.client },
                      { label: 'Status', value: projectDetails.status, isStatus: true },
                      { label: 'Start Date', value: projectDetails.startDate },
                      { label: 'End Date', value: projectDetails.endDate },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -2 }}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 cursor-pointer hover:border-white/10 transition-all"
                      >
                        <p className="text-xs text-secondary-400 font-medium mb-1">{item.label}</p>
                        {item.isStatus ? (
                          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-semibold">
                            {item.value}
                          </span>
                        ) : (
                          <p className="text-white font-semibold text-sm">{item.value}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-secondary-400 font-medium mb-2">Budget</p>
                      <p className="text-2xl font-bold text-white">{projectDetails.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-400 font-medium mb-2">Revenue</p>
                      <p className="text-2xl font-bold text-emerald-400">{projectDetails.revenue}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-secondary-400 font-medium">Progress</p>
                      <p className="text-sm font-bold text-white">{projectDetails.progress}%</p>
                    </div>
                    <div className="w-full h-2 bg-secondary-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${projectDetails.progress}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Projects & Files Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                    <p className="text-xs text-secondary-400 mt-1">Showing {projectsWithStatus.length} projects</p>
                  </div>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => handleViewAll('recent projects')}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <p className="text-secondary-400 text-sm text-center py-4">No projects yet</p>
                  ) : (
                    projects.map((project) => {
                      const statusColor = project.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : project.status === 'running'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      return (
                        <motion.div
                          key={project.id}
                          whileHover={{ x: 4 }}
                          onClick={() => handleProjectClick(project)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold text-white text-sm">{project.name}</p>
                            <p className="text-xs text-secondary-400">{project.description || 'Construction'}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${statusColor}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </motion.div>

              {/* Project Files */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Project Files</h2>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => handleViewAll('files')}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl flex-shrink-0">{file.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm truncate">{file.name}</p>
                          <p className="text-xs text-secondary-400">{file.size}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDownload(file.name)}
                        className="p-2 rounded-lg text-secondary-400 group-hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-secondary-800/50 via-secondary-900/50 to-secondary-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:border-white/10 transition-all"
            >
              <h2 className="text-lg font-bold text-white mb-8">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveModal(action.modal)}
                      className={`bg-gradient-to-br ${action.color} ${action.hover} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-white font-semibold transition-all active:scale-95`}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-sm text-center">{action.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals Container */}
      {/* Add Client Modal */}
        <Modal title="Add New Client">
          {activeModal === 'addClient' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Add Client
              </button>
            </form>
          )}
        </Modal>

        {/* Create Invoice Modal */}
        <Modal title="Create Invoice">
          {activeModal === 'createInvoice' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Invoice Number</label>
                <input
                  type="text"
                  required
                  placeholder="INV-001"
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Create Invoice
              </button>
            </form>
          )}
        </Modal>

        {/* View Reports Modal */}
        <Modal title="Reports">
          {activeModal === 'viewReports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {['Daily Report', 'Weekly Report', 'Monthly Report'].map((report, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="p-3 bg-secondary-800/50 hover:bg-secondary-800 border border-white/10 rounded-xl text-left transition-all"
                  >
                    <p className="font-semibold text-white">{report}</p>
                    <p className="text-xs text-secondary-400 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </Modal>

        {/* Expenses Modal */}
        <Modal title="Add Expense">
          {activeModal === 'expenses' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Expense Type</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="e.g., Materials, Labour"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Notes</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Add notes"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Add Expense
              </button>
            </form>
          )}
        </Modal>

        {/* Add Project Modal */}
        <Modal title="Add New Project">
          {activeModal === 'addProject' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Budget (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-secondary-800/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                Create Project
              </button>
            </form>
          )}
        </Modal>

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProjectForDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjectForDetails(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-secondary-900 to-secondary-950 border border-white/10 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedProjectForDetails.name}</h2>
                      <p className="text-secondary-400">{selectedProjectForDetails.description || 'Construction Project'}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProjectForDetails(null)}
                      className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-secondary-400" />
                    </motion.button>
                  </div>

                  {/* Download Buttons */}
                  <div className="flex gap-3 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadPDF(selectedProjectForDetails)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadExcel(selectedProjectForDetails)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Excel
                    </motion.button>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Client Info */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                      <p className="text-secondary-400 text-sm mb-1">Client</p>
                      <p className="text-xl font-bold text-white">{selectedProjectForDetails.client_name}</p>
                      {selectedProjectForDetails.client_email && <p className="text-xs text-secondary-400 mt-1">{selectedProjectForDetails.client_email}</p>}
                      {selectedProjectForDetails.client_phone && <p className="text-xs text-secondary-400">{selectedProjectForDetails.client_phone}</p>}
                    </motion.div>

                    {/* Owner Info */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                      <p className="text-secondary-400 text-sm mb-1">Owner</p>
                      <p className="text-xl font-bold text-white">{selectedProjectForDetails.owner}</p>
                      <p className="text-xs text-secondary-400 mt-1">{selectedProjectForDetails.ownerPhone}</p>
                    </motion.div>

                    {/* Status */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                      <p className="text-secondary-400 text-sm mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                        selectedProjectForDetails.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        selectedProjectForDetails.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {selectedProjectForDetails.status.toUpperCase()}
                      </span>
                    </motion.div>

                    {/* Progress */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                      <p className="text-secondary-400 text-sm mb-2">Progress</p>
                      <p className="text-2xl font-bold text-white mb-2">{selectedProjectForDetails.progress}%</p>
                      <div className="w-full h-2 bg-secondary-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProjectForDetails.progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary-600 to-accent-600"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Address */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5 mb-6">
                    <p className="text-secondary-400 text-sm mb-2">Site Address</p>
                    <p className="text-white">{selectedProjectForDetails.address}</p>
                  </motion.div>

                  {/* Measurements */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Property Measurements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                        <p className="text-secondary-400 text-xs mb-1">Length</p>
                        <p className="text-xl font-bold text-white">{selectedProjectForDetails.length}m</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                        <p className="text-secondary-400 text-xs mb-1">Width</p>
                        <p className="text-xl font-bold text-white">{selectedProjectForDetails.width}m</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                        <p className="text-secondary-400 text-xs mb-1">Area</p>
                        <p className="text-xl font-bold text-white">{selectedProjectForDetails.area}m²</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-4 bg-secondary-800/30 rounded-lg border border-white/5">
                        <p className="text-secondary-400 text-xs mb-1">Square Feet</p>
                        <p className="text-xl font-bold text-white">{Math.round(selectedProjectForDetails.area * 10.764)}</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Financial Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                        <p className="text-secondary-400 text-xs mb-1">Total Budget</p>
                        <p className="text-lg font-bold text-blue-400">₹{(selectedProjectForDetails.budget / 100000).toFixed(1)}L</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
                        <p className="text-secondary-400 text-xs mb-1">Expenses</p>
                        <p className="text-lg font-bold text-red-400">₹{(selectedProjectForDetails.expenses / 100000).toFixed(1)}L</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-secondary-400 text-xs mb-1">Material Cost</p>
                        <p className="text-lg font-bold text-emerald-400">₹{(selectedProjectForDetails.materialCost / 100000).toFixed(1)}L</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-lg">
                        <p className="text-secondary-400 text-xs mb-1">Labour Cost</p>
                        <p className="text-lg font-bold text-orange-400">₹{(selectedProjectForDetails.labourCost / 100000).toFixed(1)}L</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Materials */}
                  {selectedProjectForDetails.materials && selectedProjectForDetails.materials.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Materials ({selectedProjectForDetails.materials.length})</h3>
                      <div className="space-y-3">
                        {selectedProjectForDetails.materials.map((material: any, idx: number) => (
                          <motion.div
                            key={material.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + idx * 0.05 }}
                            className="p-4 bg-secondary-800/30 rounded-lg border border-white/5"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-white">{material.name}</p>
                                <p className="text-xs text-secondary-400">{material.supplier}</p>
                              </div>
                              <span className="text-sm font-bold text-primary-400">₹{(material.cost / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-secondary-400">
                              <div>Qty: {material.quantity} {material.unit}</div>
                              <div>Used: {material.used}</div>
                              <div>Remaining: {material.quantity - material.used}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </DashboardLayout>
  )
}
