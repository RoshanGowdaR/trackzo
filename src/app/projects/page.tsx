'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  ChevronRight,
  User,
  MapPin,
  Ruler,
  Settings,
  Package,
  Calculator,
  TrendingUp,
  FileText,
  MessageSquare,
  BarChart3,
  Edit2,
  Trash2,
  X,
  Download,
  Upload,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import SafeChart from '@/components/SafeChart'
import { useProjectStore, type Material, type Project } from '@/store/useProjectStore'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Full Dashboard', icon: BarChart3 },
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'customer', label: 'Customer Profile', icon: User },
  { id: 'owner', label: 'Owner Details', icon: User },
  { id: 'address', label: 'Site Address', icon: MapPin },
  { id: 'measurements', label: 'Property Measurements', icon: Ruler },
  { id: 'details', label: 'Construction Details', icon: Settings },
  { id: 'materials', label: 'Material Management', icon: Package },
  { id: 'estimation', label: 'Cost Estimation', icon: Calculator },
  { id: 'expenses', label: 'Expense Tracker', icon: TrendingUp },
  { id: 'progress', label: 'Construction Progress', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notes', label: 'Notes', icon: MessageSquare },
]

export default function ProjectDashboardPage() {
  const { selectedProjectId, getProjectById, addMaterial, deleteMaterial, loadFromStorage, updateProject, addExpense, deleteExpense } = useProjectStore()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    loadFromStorage()
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [loadFromStorage])

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null

  const [activeSection, setActiveSection] = useState('overview')
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false)
  const [showConstructionModal, setShowConstructionModal] = useState(false)
  const [showConstructionEditModal, setShowConstructionEditModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [documents, setDocuments] = useState<any[]>([])
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  const [materialForm, setMaterialForm] = useState({
    name: '',
    quantity: 0,
    used: 0,
    unit: '',
    cost: 0,
    supplier: '',
    purchaseDate: '',
  })

  const [addressForm, setAddressForm] = useState({
    address: project?.address || '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
  })

  const [measurementsForm, setMeasurementsForm] = useState({
    length: project?.length || 0,
    width: project?.width || 0,
    area: project?.area || 0,
    floors: 0,
  })

  const [constructionForm, setConstructionForm] = useState({
    foundation: '0%',
    excavation: '0%',
    pcc: '0%',
    footing: '0%',
    column: '0%',
    beam: '0%',
    roof: '0%',
    brickwork: '0%',
    plastering: '0%',
    flooring: '0%',
    painting: '0%',
    electrical: '0%',
    plumbing: '0%',
  })

  const [expenseForm, setExpenseForm] = useState({
    category: 'Material',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const remainingBudget = project ? project.budget - project.expenses : 0
  const remainingPercentage = project ? (remainingBudget / project.budget) * 100 : 0

  const handleAddMaterial = () => {
    if (!selectedProjectId || !materialForm.name.trim() || !materialForm.unit.trim()) {
      alert('⚠️ Please fill in required fields')
      return
    }

    const newMaterial: Material = {
      id: Date.now(),
      name: materialForm.name,
      quantity: materialForm.quantity,
      used: materialForm.used,
      unit: materialForm.unit,
      cost: materialForm.cost,
      supplier: materialForm.supplier,
      purchaseDate: materialForm.purchaseDate,
    }

    addMaterial(selectedProjectId, newMaterial)
    setMaterialForm({ name: '', quantity: 0, used: 0, unit: '', cost: 0, supplier: '', purchaseDate: '' })
    setShowMaterialModal(false)
    alert('✅ Material added successfully!')
  }

  const handleDeleteMaterial = (materialId: number) => {
    if (!selectedProjectId) return
    deleteMaterial(selectedProjectId, materialId)
    alert('✅ Material deleted!')
  }

  const handleSaveAddress = () => {
    if (!selectedProjectId) return
    updateProject(selectedProjectId, {
      address: addressForm.address,
    })
    setShowAddressModal(false)
    alert('✅ Address updated!')
  }

  const handleSaveMeasurements = () => {
    if (!selectedProjectId) return
    const calculatedArea = measurementsForm.length * measurementsForm.width
    updateProject(selectedProjectId, {
      length: measurementsForm.length,
      width: measurementsForm.width,
      area: calculatedArea,
    })
    setShowMeasurementsModal(false)
    alert('✅ Measurements updated!')
  }

  const handleAddExpense = () => {
    if (!selectedProjectId || !expenseForm.category || !expenseForm.amount) {
      alert('⚠️ Please fill in required fields')
      return
    }
    const newExpense = {
      id: Date.now(),
      category: expenseForm.category,
      amount: expenseForm.amount,
      date: expenseForm.date,
      description: expenseForm.description,
    }
    addExpense(selectedProjectId, newExpense)
    setExpenseForm({ category: 'Material', amount: 0, date: new Date().toISOString().split('T')[0], description: '' })
    setShowExpenseModal(false)
    alert('✅ Expense added to this project!')
  }

  const handleDeleteExpense = (expenseId: number) => {
    if (!selectedProjectId) return
    deleteExpense(selectedProjectId, expenseId)
    alert('✅ Expense deleted!')
  }

  const handleAddDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        setDocuments([...documents, { id: Date.now(), name: file.name, size: (file.size / 1024).toFixed(2), type: file.type }])
        alert(`✅ Document "${file.name}" added!`)
      }
    }
    input.click()
  }

  const handleSaveConstructionDetails = () => {
    // Calculate average progress from all construction phases
    const values = Object.values(constructionForm).map(v => parseInt(v.toString()) || 0)
    const avgProgress = Math.round(values.reduce((a, b) => a + b, 0) / values.length)

    if (!selectedProjectId) return
    updateProject(selectedProjectId, {
      // Store construction details in a structured way
      // This would need a database field to store properly
    })

    setShowConstructionEditModal(false)
    alert('✅ Construction details updated!')
  }

  // Helper function to filter expenses by date range
  const getFilteredExpenses = () => {
    if (!project?.expenseDetails) return []
    return project.expenseDetails.filter(exp => {
      const expDate = new Date(exp.date)
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      return expDate >= startDate && expDate <= endDate
    })
  }

  // Report Generation Functions
  const generateProjectSummaryPDF = () => {
    if (!project) return

    const pdf = new jsPDF()
    let yPos = 20

    // Title
    pdf.setFontSize(20)
    pdf.setTextColor(37, 99, 235)
    pdf.text('PROJECT SUMMARY REPORT', 20, yPos)
    yPos += 15

    // Basic Info
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Project Details', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Project Name: ${project.name}`, 20, yPos)
    yPos += 6
    pdf.text(`Client: ${project.client_name}`, 20, yPos)
    yPos += 6
    pdf.text(`Status: ${project.status.toUpperCase()}`, 20, yPos)
    yPos += 6
    pdf.text(`Progress: ${project.progress}%`, 20, yPos)
    yPos += 6
    pdf.text(`Address: ${project.address}`, 20, yPos)
    yPos += 10

    // Financial Summary
    pdf.setFont('helvetica', 'bold')
    pdf.text('Financial Summary', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.text(`Total Budget: ₹${(project.budget / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Expenses: ₹${(project.expenses / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Material Cost: ₹${(project.materialCost / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Labour Cost: ₹${(project.labourCost / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Remaining Budget: ₹${(remainingBudget / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 10

    // Property Details
    pdf.setFont('helvetica', 'bold')
    pdf.text('Property Details', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.text(`Length: ${project.length}m | Width: ${project.width}m | Area: ${project.area}m²`, 20, yPos)
    yPos += 6
    pdf.text(`Square Feet: ${Math.round(project.area * 10.764)} sqft`, 20, yPos)

    pdf.save(`${project.name}_Summary_Report.pdf`)
    alert('✅ Project Summary PDF downloaded!')
  }

  const generateProjectSummaryExcel = () => {
    if (!project) return

    const ws = XLSX.utils.aoa_to_sheet([
      ['PROJECT SUMMARY REPORT'],
      [],
      ['Project Details'],
      ['Project Name', project.name],
      ['Client', project.client_name],
      ['Status', project.status],
      ['Progress', `${project.progress}%`],
      ['Address', project.address],
      [],
      ['Financial Summary'],
      ['Total Budget', `₹${(project.budget / 100000).toFixed(1)}L`],
      ['Expenses', `₹${(project.expenses / 100000).toFixed(1)}L`],
      ['Material Cost', `₹${(project.materialCost / 100000).toFixed(1)}L`],
      ['Labour Cost', `₹${(project.labourCost / 100000).toFixed(1)}L`],
      ['Remaining Budget', `₹${(remainingBudget / 100000).toFixed(1)}L`],
      [],
      ['Property Details'],
      ['Length', `${project.length}m`],
      ['Width', `${project.width}m`],
      ['Area', `${project.area}m²`],
      ['Square Feet', `${Math.round(project.area * 10.764)} sqft`],
    ])

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Summary')
    XLSX.writeFile(wb, `${project.name}_Summary_Report.xlsx`)
    alert('✅ Project Summary Excel downloaded!')
  }

  const generateFinancialReportPDF = () => {
    if (!project) return

    const filteredExpenses = getFilteredExpenses()
    const pdf = new jsPDF()
    let yPos = 20

    pdf.setFontSize(20)
    pdf.setTextColor(37, 99, 235)
    pdf.text('FINANCIAL REPORT', 20, yPos)
    yPos += 10

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, 20, yPos)
    yPos += 8

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Project: ' + project.name, 20, yPos)
    yPos += 10

    // Budget Summary
    pdf.setFont('helvetica', 'bold')
    pdf.text('Budget Summary', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Total Budget: ₹${(project.budget / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Total Spent: ₹${(project.expenses / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Remaining: ₹${(remainingBudget / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6

    const spentPercentage = project.budget > 0 ? ((project.expenses / project.budget) * 100).toFixed(1) : '0'
    pdf.text(`Spent Percentage: ${spentPercentage}%`, 20, yPos)
    yPos += 10

    // Cost Breakdown
    pdf.setFont('helvetica', 'bold')
    pdf.text('Cost Breakdown', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.text(`Material Cost: ₹${(project.materialCost / 100000).toFixed(1)}L (${project.budget > 0 ? ((project.materialCost / project.budget) * 100).toFixed(1) : '0'}%)`, 20, yPos)
    yPos += 6
    pdf.text(`Labour Cost: ₹${(project.labourCost / 100000).toFixed(1)}L (${project.budget > 0 ? ((project.labourCost / project.budget) * 100).toFixed(1) : '0'}%)`, 20, yPos)
    yPos += 10

    // Expenses List
    if (filteredExpenses.length > 0) {
      pdf.setFont('helvetica', 'bold')
      pdf.text('Expenses Details (Filtered by Date Range)', 20, yPos)
      yPos += 8

      pdf.setFont('helvetica', 'normal')
      filteredExpenses.forEach((exp) => {
        pdf.text(`${exp.date} | ${exp.category} | ₹${exp.amount.toLocaleString()} - ${exp.description}`, 20, yPos)
        yPos += 6
      })
    }

    pdf.save(`${project.name}_Financial_Report.pdf`)
    alert('✅ Financial Report PDF downloaded!')
  }

  const generateFinancialReportExcel = () => {
    if (!project) return

    const filteredExpenses = getFilteredExpenses()
    const data = [
      ['FINANCIAL REPORT'],
      [`Project: ${project.name}`],
      [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`],
      [],
      ['Budget Summary'],
      ['Total Budget', `₹${(project.budget / 100000).toFixed(1)}L`],
      ['Total Spent', `₹${(project.expenses / 100000).toFixed(1)}L`],
      ['Remaining', `₹${(remainingBudget / 100000).toFixed(1)}L`],
      [`Spent Percentage`, `${project.budget > 0 ? ((project.expenses / project.budget) * 100).toFixed(1) : '0'}%`],
      [],
      ['Cost Breakdown'],
      ['Material Cost', `₹${(project.materialCost / 100000).toFixed(1)}L`, `${project.budget > 0 ? ((project.materialCost / project.budget) * 100).toFixed(1) : '0'}%`],
      ['Labour Cost', `₹${(project.labourCost / 100000).toFixed(1)}L`, `${project.budget > 0 ? ((project.labourCost / project.budget) * 100).toFixed(1) : '0'}%`],
    ]

    if (filteredExpenses.length > 0) {
      data.push([], ['Expenses Details (Filtered by Date Range)'], ['Date', 'Category', 'Amount', 'Description'])
      filteredExpenses.forEach((exp) => {
        data.push([exp.date, exp.category, `₹${exp.amount}`, exp.description])
      })
    }

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Financial')
    XLSX.writeFile(wb, `${project.name}_Financial_Report.xlsx`)
    alert('✅ Financial Report Excel downloaded!')
  }

  const generateMaterialReportPDF = () => {
    if (!project) return

    const pdf = new jsPDF()
    let yPos = 20

    pdf.setFontSize(20)
    pdf.setTextColor(37, 99, 235)
    pdf.text('MATERIAL REPORT', 20, yPos)
    yPos += 15

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Project: ' + project.name, 20, yPos)
    yPos += 10

    pdf.setFont('helvetica', 'bold')
    pdf.text('Materials Summary', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Total Materials: ${project.materials.length}`, 20, yPos)
    yPos += 6
    pdf.text(`Total Material Cost: ₹${(project.materialCost / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 10

    // Materials List
    pdf.setFont('helvetica', 'bold')
    pdf.text('Material Details', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)

    project.materials.forEach((material) => {
      const remaining = material.quantity - material.used
      pdf.text(`• ${material.name}`, 20, yPos)
      yPos += 5
      pdf.text(`  Qty: ${material.quantity} ${material.unit} | Used: ${material.used} | Remaining: ${remaining}`, 22, yPos)
      yPos += 5
      pdf.text(`  Cost: ₹${(material.cost / 1000).toFixed(0)}K | Supplier: ${material.supplier}`, 22, yPos)
      yPos += 7
    })

    pdf.save(`${project.name}_Material_Report.pdf`)
    alert('✅ Material Report PDF downloaded!')
  }

  const generateMaterialReportExcel = () => {
    if (!project) return

    const data = [
      ['MATERIAL REPORT'],
      [`Project: ${project.name}`],
      [],
      ['Materials Summary'],
      ['Total Materials', project.materials.length],
      ['Total Material Cost', `₹${(project.materialCost / 100000).toFixed(1)}L`],
      [],
      ['Material Details'],
      ['Material Name', 'Quantity', 'Unit', 'Used', 'Remaining', 'Cost (₹)', 'Supplier'],
    ]

    project.materials.forEach((material) => {
      const remaining = material.quantity - material.used
      data.push([
        material.name,
        material.quantity,
        material.unit,
        material.used,
        remaining,
        material.cost,
        material.supplier,
      ])
    })

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Materials')
    XLSX.writeFile(wb, `${project.name}_Material_Report.xlsx`)
    alert('✅ Material Report Excel downloaded!')
  }

  const generateLabourReportPDF = () => {
    if (!project) return

    const pdf = new jsPDF()
    let yPos = 20

    pdf.setFontSize(20)
    pdf.setTextColor(37, 99, 235)
    pdf.text('LABOUR REPORT', 20, yPos)
    yPos += 15

    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Project: ' + project.name, 20, yPos)
    yPos += 10

    pdf.setFont('helvetica', 'bold')
    pdf.text('Labour Summary', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Total Labour Cost: ₹${(project.labourCost / 100000).toFixed(1)}L`, 20, yPos)
    yPos += 6
    pdf.text(`Percentage of Budget: ${project.budget > 0 ? ((project.labourCost / project.budget) * 100).toFixed(1) : '0'}%`, 20, yPos)
    yPos += 6
    pdf.text(`Percentage of Total Expenses: ${project.expenses > 0 ? ((project.labourCost / project.expenses) * 100).toFixed(1) : '0'}%`, 20, yPos)
    yPos += 10

    // Construction Phases
    pdf.setFont('helvetica', 'bold')
    pdf.text('Construction Phases Progress', 20, yPos)
    yPos += 8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    Object.entries(constructionForm).forEach(([key, value]) => {
      pdf.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 20, yPos)
      yPos += 5
    })

    pdf.save(`${project.name}_Labour_Report.pdf`)
    alert('✅ Labour Report PDF downloaded!')
  }

  const generateLabourReportExcel = () => {
    if (!project) return

    const data = [
      ['LABOUR REPORT'],
      [`Project: ${project.name}`],
      [],
      ['Labour Summary'],
      ['Total Labour Cost', `₹${(project.labourCost / 100000).toFixed(1)}L`],
      [`Percentage of Budget`, `${project.budget > 0 ? ((project.labourCost / project.budget) * 100).toFixed(1) : '0'}%`],
      [`Percentage of Total Expenses`, `${project.expenses > 0 ? ((project.labourCost / project.expenses) * 100).toFixed(1) : '0'}%`],
      [],
      ['Construction Phases Progress'],
    ]

    Object.entries(constructionForm).forEach(([key, value]) => {
      data.push([key.charAt(0).toUpperCase() + key.slice(1), value])
    })

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Labour')
    XLSX.writeFile(wb, `${project.name}_Labour_Report.xlsx`)
    alert('✅ Labour Report Excel downloaded!')
  }

  // Download All Reports at Once
  const downloadAllReportsExcel = () => {
    if (!project) return

    const filteredExpenses = getFilteredExpenses()
    const wb = XLSX.utils.book_new()

    // Sheet 1: Summary
    const summaryData = [
      ['PROJECT COMPREHENSIVE REPORT'],
      [`Project: ${project.name}`],
      [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [],
      ['PROJECT DETAILS'],
      ['Name', project.name],
      ['Client', project.client_name],
      ['Status', project.status],
      ['Progress', `${project.progress}%`],
      ['Address', project.address],
      [],
      ['FINANCIAL SUMMARY'],
      ['Total Budget', `₹${(project.budget / 100000).toFixed(1)}L`],
      ['Total Spent', `₹${(project.expenses / 100000).toFixed(1)}L`],
      ['Remaining', `₹${(remainingBudget / 100000).toFixed(1)}L`],
      ['Material Cost', `₹${(project.materialCost / 100000).toFixed(1)}L`],
      ['Labour Cost', `₹${(project.labourCost / 100000).toFixed(1)}L`],
      [],
      ['PROPERTY DETAILS'],
      ['Length', `${project.length}m`],
      ['Width', `${project.width}m`],
      ['Area', `${project.area}m²`],
      ['Square Feet', `${Math.round(project.area * 10.764)} sqft`],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

    // Sheet 2: Financial Details
    const financialData: any[][] = [
      ['FINANCIAL REPORT'],
      [`Project: ${project.name}`],
      [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`],
      [],
      ['EXPENSES (FILTERED BY DATE)'],
      ['Date', 'Category', 'Amount', 'Description'],
    ]
    filteredExpenses.forEach((exp) => {
      financialData.push([exp.date, exp.category, exp.amount, exp.description])
    })
    const financialSheet = XLSX.utils.aoa_to_sheet(financialData)
    XLSX.utils.book_append_sheet(wb, financialSheet, 'Expenses')

    // Sheet 3: Materials
    const materialsData: any[][] = [
      ['MATERIAL REPORT'],
      [`Project: ${project.name}`],
      [],
      ['Material Details'],
      ['Name', 'Quantity', 'Unit', 'Used', 'Remaining', 'Cost', 'Supplier'],
    ]
    project.materials.forEach((material) => {
      const remaining = material.quantity - material.used
      materialsData.push([material.name, material.quantity, material.unit, material.used, remaining, material.cost, material.supplier])
    })
    const materialsSheet = XLSX.utils.aoa_to_sheet(materialsData)
    XLSX.utils.book_append_sheet(wb, materialsSheet, 'Materials')

    // Sheet 4: Construction Progress
    const constructionData: any[][] = [
      ['CONSTRUCTION PROGRESS REPORT'],
      [`Project: ${project.name}`],
      [],
      ['Construction Phases'],
    ]
    Object.entries(constructionForm).forEach(([key, value]) => {
      constructionData.push([key.charAt(0).toUpperCase() + key.slice(1), value])
    })
    const constructionSheet = XLSX.utils.aoa_to_sheet(constructionData)
    XLSX.utils.book_append_sheet(wb, constructionSheet, 'Progress')

    XLSX.writeFile(wb, `${project.name}_Complete_Report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`)
    alert('✅ Complete Report (All Sheets) Excel downloaded!')
  }

  const progressChartOptions = {
    chart: { type: 'radialBar' as const, width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, toolbar: { show: false } },
    colors: ['#3B82F6'],
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: false },
          value: { color: '#fff', fontSize: '18px', fontWeight: 'bold' },
        },
      },
    },
    labels: ['Progress'],
  }

  const expenseChartOptions = {
    chart: { type: 'donut' as const, width: '100%', redrawOnParentResize: true, redrawOnWindowResize: true, toolbar: { show: false } },
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    labels: ['Remaining Budget', 'Expenses', 'Reserved'],
    tooltip: { theme: 'dark' as const },
    legend: { position: 'bottom' as const },
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">No Project Selected</p>
          <p className="text-secondary-400">Select a project from the list to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Secondary Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 flex-shrink-0 bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-120px)]"
      >
        <h3 className="text-lg font-bold text-white mb-4">Dashboard Menu</h3>
        <div className="space-y-2">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-600'
                    : 'text-secondary-300 hover:bg-secondary-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                {activeSection === item.id && <ChevronRight className="w-4 h-4" />}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 space-y-6 overflow-y-auto pb-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-secondary-400">Client: {project.client_name} | Status: <span className={`font-semibold ${project.status === 'running' ? 'text-blue-400' : project.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{project.status}</span></p>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-blue-600/20 to-blue-400/5 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-blue-400">₹{(project.budget / 100000).toFixed(1)}L</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-red-600/20 to-red-400/5 border border-red-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-400">₹{(project.expenses / 100000).toFixed(1)}L</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-emerald-600/20 to-emerald-400/5 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Material Cost</p>
            <p className="text-2xl font-bold text-emerald-400">₹{(project.materialCost / 100000).toFixed(1)}L</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-orange-600/20 to-orange-400/5 border border-orange-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Labour Cost</p>
            <p className="text-2xl font-bold text-orange-400">₹{(project.labourCost / 100000).toFixed(1)}L</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-600/20 to-purple-400/5 border border-purple-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Progress</p>
            <p className="text-2xl font-bold text-purple-400">{project.progress}%</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-600/20 to-green-400/5 border border-green-500/20 rounded-2xl p-4">
            <p className="text-xs text-secondary-400 mb-1">Remaining Budget</p>
            <p className="text-2xl font-bold text-green-400">₹{(remainingBudget / 100000).toFixed(1)}L</p>
          </motion.div>
        </div>

        {/* Dynamic Content Based on Section */}
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
              {/* Project Summary Cards Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-primary-600/20 to-primary-400/5 border border-primary-500/20 rounded-2xl p-6">
                  <p className="text-secondary-400 text-sm mb-2">Project Status</p>
                  <p className="text-2xl font-bold text-primary-400 capitalize">{project.status}</p>
                  <p className="text-xs text-secondary-400 mt-2">{project.name}</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-600/20 to-purple-400/5 border border-purple-500/20 rounded-2xl p-6">
                  <p className="text-secondary-400 text-sm mb-2">Overall Progress</p>
                  <p className="text-2xl font-bold text-purple-400">{project.progress}%</p>
                  <div className="w-full h-2 bg-secondary-700 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-600/20 to-green-400/5 border border-green-500/20 rounded-2xl p-6">
                  <p className="text-secondary-400 text-sm mb-2">Remaining Budget</p>
                  <p className="text-2xl font-bold text-green-400">₹{(remainingBudget / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-secondary-400 mt-2">{remainingPercentage.toFixed(1)}% left</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-orange-600/20 to-orange-400/5 border border-orange-500/20 rounded-2xl p-6">
                  <p className="text-secondary-400 text-sm mb-2">Start Date</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {project.startDate || 'Not set'}
                  </p>
                  <p className="text-xs text-secondary-400 mt-2">Project started</p>
                </motion.div>
              </div>

              {/* Client & Owner Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">👤 Client Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-secondary-400 text-sm">Name</p>
                      <p className="text-white font-semibold">{project.client_name}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400 text-sm">Email</p>
                      <p className="text-white font-semibold">{project.client_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400 text-sm">Phone</p>
                      <p className="text-white font-semibold">{project.client_phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">🏢 Project Owner</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-secondary-400 text-sm">Owner Name</p>
                      <p className="text-white font-semibold">{project.owner}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400 text-sm">Contact</p>
                      <p className="text-white font-semibold">{project.ownerPhone}</p>
                    </div>
                    <div>
                      <p className="text-secondary-400 text-sm">Address</p>
                      <p className="text-white font-semibold text-sm">{project.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget & Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">💰 Financial Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Total Budget</span>
                      <span className="text-xl font-bold text-primary-400">₹{(project.budget / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Spent</span>
                      <span className="text-xl font-bold text-red-400">₹{(project.expenses / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Material Cost</span>
                      <span className="text-xl font-bold text-green-400">₹{(project.materialCost / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Labour Cost</span>
                      <span className="text-xl font-bold text-orange-400">₹{(project.labourCost / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="h-2 bg-secondary-700 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${project.budget > 0 ? (project.expenses / project.budget) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-xs text-secondary-400 text-center">{project.budget > 0 ? ((project.expenses / project.budget) * 100).toFixed(1) : '0'}% spent</p>
                  </div>
                </div>

                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">📐 Property Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Length</span>
                      <span className="text-xl font-bold text-white">{project.length}m</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Width</span>
                      <span className="text-xl font-bold text-white">{project.width}m</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Area (m²)</span>
                      <span className="text-xl font-bold text-white">{project.area}m²</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg">
                      <span className="text-secondary-400">Area (sqft)</span>
                      <span className="text-xl font-bold text-white">{Math.round(project.area * 10.764)} sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials & Expenses Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">📦 Materials ({project.materials.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {project.materials.length === 0 ? (
                      <p className="text-secondary-400 text-sm">No materials added</p>
                    ) : (
                      project.materials.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2 bg-secondary-800/50 rounded text-sm">
                          <span className="text-secondary-300">{m.name}</span>
                          <span className="text-primary-400 font-semibold">{m.quantity} {m.unit}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">💸 Expenses ({project.expenseDetails?.length || 0})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {!project.expenseDetails || project.expenseDetails.length === 0 ? (
                      <p className="text-secondary-400 text-sm">No expenses recorded</p>
                    ) : (
                      project.expenseDetails.slice(-5).map(e => (
                        <div key={e.id} className="flex items-center justify-between p-2 bg-secondary-800/50 rounded text-sm">
                          <span className="text-secondary-300">{e.category}</span>
                          <span className="text-red-400 font-semibold">₹{(e.amount / 1000).toFixed(0)}K</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-lg font-bold text-white mb-4">🏗️ Construction Phase</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-300">Top Progress</span>
                      <span className="text-green-400 font-semibold">{Object.entries(constructionForm).reduce((max, [k, v]) => {
                        const val = parseInt(v.toString()) || 0;
                        return val > parseInt(max.toString()) ? val : max;
                      }, 0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-300">Completed Phases</span>
                      <span className="text-primary-400 font-semibold">{Object.values(constructionForm).filter(v => parseInt(v.toString()) === 100).length}/13</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary-300">Average Progress</span>
                      <span className="text-blue-400 font-semibold">{Math.round(Object.values(constructionForm).reduce((a, b) => a + parseInt(b.toString()), 0) / Object.values(constructionForm).length)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Timeline */}
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4">📅 Project Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Start Date</p>
                    <p className="text-xl font-bold text-white">{project.startDate || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">End Date</p>
                    <p className="text-xl font-bold text-white">{project.endDate || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Status</p>
                    <p className="text-xl font-bold text-white capitalize">
                      {project.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection('reports')} className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold">
                  📊 View Reports
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection('expenses')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                  💸 Expenses
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection('details')} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">
                  🏗️ Construction
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveSection('materials')} className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
                  📦 Materials
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4">Project Progress</h3>
                {mounted && (
                  <SafeChart
                    options={progressChartOptions}
                    series={[project.progress > 0 ? project.progress : 1]}
                    type="radialBar"
                    height={280}
                  />
                )}
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white mb-4">Budget Breakdown</h3>
                {mounted && (
                  <SafeChart
                    options={expenseChartOptions}
                    series={(remainingBudget + project.expenses > 0) ? [remainingBudget, project.expenses, 0] : [100, 0, 0]}
                    type="donut"
                    height={280}
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'customer' && (
            <motion.div key="customer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Customer Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Client Name</p>
                  <p className="text-2xl font-bold text-white">{project.client_name}</p>
                </div>
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Email</p>
                  <p className="text-lg text-white">{project.client_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Phone</p>
                  <p className="text-lg text-white">{project.client_phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Project</p>
                  <p className="text-lg text-white">{project.name}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'owner' && (
            <motion.div key="owner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Owner Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Owner Name</p>
                  <p className="text-xl text-white">{project.owner}</p>
                </div>
                <div>
                  <p className="text-secondary-400 text-sm mb-2">Phone</p>
                  <p className="text-xl text-white">{project.ownerPhone}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'address' && (
            <motion.div key="address" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Site Address</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAddressModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </motion.button>
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <p className="text-xl text-secondary-300">{project.address || 'No address added'}</p>
              </div>
            </motion.div>
          )}

          {activeSection === 'measurements' && (
            <motion.div key="measurements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Property Measurements</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowMeasurementsModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </motion.button>
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Length</p>
                    <p className="text-3xl font-bold text-white">{project.length}m</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Width</p>
                    <p className="text-3xl font-bold text-white">{project.width}m</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Area (m²)</p>
                    <p className="text-3xl font-bold text-white">{project.area}m²</p>
                  </div>
                  <div>
                    <p className="text-secondary-400 text-sm mb-2">Square Feet</p>
                    <p className="text-3xl font-bold text-white">{Math.round(project.area * 10.764)} sqft</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Construction Details</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowConstructionEditModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </motion.button>
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(constructionForm).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-secondary-300 capitalize font-semibold">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <span className={`text-sm font-bold ${parseInt(value.toString()) === 0 ? 'text-secondary-400' : parseInt(value.toString()) < 50 ? 'text-yellow-400' : parseInt(value.toString()) < 100 ? 'text-blue-400' : 'text-green-400'}`}>{value}</span>
                      </div>
                      <div className="h-3 bg-secondary-700 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${parseInt(value.toString()) === 0 ? 'bg-gray-600' : parseInt(value.toString()) < 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : parseInt(value.toString()) < 100 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`} style={{ width: value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'materials' && (
            <motion.div key="materials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Material Management</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowMaterialModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Plus className="w-4 h-4" />
                  Add Material
                </motion.button>
              </div>

              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary-800/50 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Material</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Quantity</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Used</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Remaining</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Cost</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Supplier</th>
                        <th className="px-6 py-3 text-left text-secondary-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {project.materials.map(material => (
                        <motion.tr key={material.id} whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} className="transition-colors">
                          <td className="px-6 py-3 text-white font-medium">{material.name}</td>
                          <td className="px-6 py-3 text-secondary-300">{material.quantity} {material.unit}</td>
                          <td className="px-6 py-3 text-secondary-300">{material.used} {material.unit}</td>
                          <td className="px-6 py-3 text-secondary-300">{material.quantity - material.used} {material.unit}</td>
                          <td className="px-6 py-3 text-primary-400 font-semibold">₹{(material.cost / 1000).toFixed(0)}K</td>
                          <td className="px-6 py-3 text-secondary-300 text-sm">{material.supplier}</td>
                          <td className="px-6 py-3 flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDeleteMaterial(material.id)} className="p-1 hover:bg-red-600/20 rounded">
                              <Trash2 className="w-4 h-4 text-secondary-400 hover:text-red-400" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'estimation' && (
            <motion.div key="estimation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Cost Estimation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-secondary-400 text-sm">Estimated Budget</p>
                      <p className="text-3xl font-bold text-white">₹{(project.budget / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-secondary-400 text-sm">Material Cost Estimate</p>
                      <p className="text-3xl font-bold text-white">₹{(project.materialCost / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                    <div>
                      <p className="text-secondary-400 text-sm">Labour Cost Estimate</p>
                      <p className="text-3xl font-bold text-white">₹{(project.labourCost / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-secondary-400 text-sm">Total Estimated Cost</p>
                      <p className="text-3xl font-bold text-white">₹{((project.materialCost + project.labourCost) / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'expenses' && (
            <motion.div key="expenses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Expense Tracker</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Plus className="w-4 h-4" />
                  Add Expense
                </motion.button>
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                {!project?.expenseDetails || project.expenseDetails.length === 0 ? (
                  <p className="text-secondary-400 text-center py-8">No expenses added for this project</p>
                ) : (
                  <div className="space-y-4">
                    {project.expenseDetails.map(exp => (
                      <div key={exp.id} className="flex items-center justify-between p-4 bg-secondary-800/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{exp.category}</p>
                          <p className="text-xs text-secondary-400">{exp.date} - {exp.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-red-400">₹{exp.amount.toLocaleString()}</p>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleDeleteExpense(exp.id)} className="p-1 hover:bg-red-600/20 rounded">
                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Construction Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">Overall Progress</span>
                    <span className="text-2xl font-bold text-primary-400">{project.progress}%</span>
                  </div>
                  <div className="h-4 bg-secondary-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-600 to-accent-600" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'documents' && (
            <motion.div key="documents" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Documents</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleAddDocument} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                  <Upload className="w-4 h-4" />
                  Upload
                </motion.button>
              </div>
              <div className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                {documents.length === 0 ? (
                  <p className="text-secondary-400 text-center py-8">No documents uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-400" />
                          <div>
                            <p className="text-white font-semibold">{doc.name}</p>
                            <p className="text-xs text-secondary-400">{doc.size} KB</p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-secondary-400 cursor-pointer hover:text-white" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Project Reports</h2>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowDateRangeModal(true)} className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold">
                  📅 Select Date Range
                </motion.button>
              </div>

              {/* Current Date Range Display */}
              <div className="bg-accent-600/20 border border-accent-500/30 rounded-lg p-4">
                <p className="text-sm text-accent-300">📊 Reports filtered for: <span className="font-bold text-white">{dateRange.startDate}</span> to <span className="font-bold text-white">{dateRange.endDate}</span></p>
              </div>

              {/* One-Shot Download Button */}
              <motion.button whileHover={{ scale: 1.02 }} onClick={downloadAllReportsExcel} className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg">
                <Download className="w-6 h-6" />
                Download All Reports (One-Shot)
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project Summary */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-primary-400" />
                    <h3 className="text-lg font-bold text-white">Project Summary</h3>
                  </div>
                  <p className="text-secondary-400 text-sm mb-4">Complete project details, budget, and progress</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateProjectSummaryPDF} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      PDF
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateProjectSummaryExcel} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      Excel
                    </motion.button>
                  </div>
                </motion.div>

                {/* Financial Report */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-accent-400" />
                    <h3 className="text-lg font-bold text-white">Financial Report</h3>
                  </div>
                  <p className="text-secondary-400 text-sm mb-4">Budget, expenses, and cost breakdown</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateFinancialReportPDF} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      PDF
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateFinancialReportExcel} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      Excel
                    </motion.button>
                  </div>
                </motion.div>

                {/* Material Report */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Material Report</h3>
                  </div>
                  <p className="text-secondary-400 text-sm mb-4">Materials inventory and suppliers</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateMaterialReportPDF} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      PDF
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateMaterialReportExcel} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      Excel
                    </motion.button>
                  </div>
                </motion.div>

                {/* Labour Report */}
                <motion.div whileHover={{ scale: 1.02 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-orange-400" />
                    <h3 className="text-lg font-bold text-white">Labour Report</h3>
                  </div>
                  <p className="text-secondary-400 text-sm mb-4">Labour costs and construction progress</p>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateLabourReportPDF} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      PDF
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={generateLabourReportExcel} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all text-sm font-semibold">
                      <Download className="w-4 h-4" />
                      Excel
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Notes</h2>
              <textarea className="w-full h-64 bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" placeholder="Add project notes here..."></textarea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showMaterialModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMaterialModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Add New Material</h3>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowMaterialModal(false)} className="text-secondary-400 hover:text-white">
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Material Name *</label>
                  <input type="text" value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} placeholder="e.g., Cement, Steel..." className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Unit *</label>
                  <input type="text" value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} placeholder="e.g., bags, tons, m³..." className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Quantity</label>
                  <input type="number" value={materialForm.quantity} onChange={(e) => setMaterialForm({ ...materialForm, quantity: parseInt(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Used Quantity</label>
                  <input type="number" value={materialForm.used} onChange={(e) => setMaterialForm({ ...materialForm, used: parseInt(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Cost (₹)</label>
                  <input type="number" value={materialForm.cost} onChange={(e) => setMaterialForm({ ...materialForm, cost: parseInt(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Supplier</label>
                  <input type="text" value={materialForm.supplier} onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })} placeholder="Supplier name" className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary-300 mb-2">Purchase Date</label>
                  <input type="date" value={materialForm.purchaseDate} onChange={(e) => setMaterialForm({ ...materialForm, purchaseDate: e.target.value })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowMaterialModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleAddMaterial} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  Add Material
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddressModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Update Site Address</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Address</label>
                  <textarea value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" rows={3} />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowAddressModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveAddress} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measurements Modal */}
      <AnimatePresence>
        {showMeasurementsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMeasurementsModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Update Property Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Length (m)</label>
                  <input type="number" value={measurementsForm.length} onChange={(e) => setMeasurementsForm({ ...measurementsForm, length: parseFloat(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Width (m)</label>
                  <input type="number" value={measurementsForm.width} onChange={(e) => setMeasurementsForm({ ...measurementsForm, width: parseFloat(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowMeasurementsModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveMeasurements} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Construction Details Edit Modal */}
      <AnimatePresence>
        {showConstructionEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConstructionEditModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-4xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Update Construction Details</h3>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowConstructionEditModal(false)} className="text-secondary-400 hover:text-white">
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {Object.entries(constructionForm).map(([key, value]) => {
                  const progressValue = parseInt(value.toString()) || 0
                  return (
                    <div key={key} className="space-y-3 bg-secondary-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" max="100" value={progressValue} onChange={(e) => setConstructionForm({ ...constructionForm, [key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)).toString() + '%' })} className="w-16 bg-secondary-700 border border-white/10 rounded px-2 py-1 text-white text-center font-bold focus:outline-none focus:border-primary-500" />
                          <span className="text-primary-400 font-bold">%</span>
                        </div>
                      </div>
                      <input type="range" min="0" max="100" value={progressValue} onChange={(e) => setConstructionForm({ ...constructionForm, [key]: e.target.value + '%' })} className="w-full h-2 bg-secondary-700 rounded-lg appearance-none cursor-pointer" style={{
                        background: `linear-gradient(to right, ${progressValue === 0 ? '#6b7280' : progressValue < 50 ? '#eab308' : progressValue < 100 ? '#3b82f6' : '#22c55e'} 0%, ${progressValue === 0 ? '#6b7280' : progressValue < 50 ? '#eab308' : progressValue < 100 ? '#3b82f6' : '#22c55e'} ${progressValue}%, #475569 ${progressValue}%, #475569 100%)`
                      }} />
                      <div className="flex justify-between text-xs text-secondary-400">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                      <div className="text-xs text-secondary-400 text-center">
                        {progressValue === 0 ? '🔴 Not Started' : progressValue < 50 ? '🟡 In Progress' : progressValue < 100 ? '🔵 Almost Done' : '🟢 Completed'}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-secondary-800/50 border border-white/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-secondary-300 mb-2">Quick Actions:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => Object.keys(constructionForm).forEach(key => setConstructionForm(f => ({ ...f, [key]: '0%' })))} className="py-2 px-3 text-xs bg-secondary-700 hover:bg-secondary-600 text-secondary-300 hover:text-white rounded transition-all">
                    Reset All
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => Object.keys(constructionForm).forEach(key => setConstructionForm(f => ({ ...f, [key]: '25%' })))} className="py-2 px-3 text-xs bg-yellow-600/30 hover:bg-yellow-600/40 text-yellow-300 rounded transition-all">
                    Set 25%
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => Object.keys(constructionForm).forEach(key => setConstructionForm(f => ({ ...f, [key]: '50%' })))} className="py-2 px-3 text-xs bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 rounded transition-all">
                    Set 50%
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => Object.keys(constructionForm).forEach(key => setConstructionForm(f => ({ ...f, [key]: '100%' })))} className="py-2 px-3 text-xs bg-green-600/30 hover:bg-green-600/40 text-green-300 rounded transition-all">
                    Complete All
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowConstructionEditModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveConstructionDetails} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  Save Construction Details
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Range Selection Modal */}
      <AnimatePresence>
        {showDateRangeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDateRangeModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">📅 Select Date Range</h3>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowDateRangeModal(false)} className="text-secondary-400 hover:text-white">
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-500"
                  />
                </div>

                {/* Quick Date Range Buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-secondary-300">Quick Selection:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        const today = new Date()
                        const last7Days = new Date(today.setDate(today.getDate() - 7))
                        setDateRange({
                          startDate: last7Days.toISOString().split('T')[0],
                          endDate: new Date().toISOString().split('T')[0],
                        })
                      }}
                      className="py-2 px-3 text-xs bg-primary-600/30 hover:bg-primary-600/50 text-primary-300 rounded-lg transition-all font-semibold"
                    >
                      Last 7 Days
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        const today = new Date()
                        const last30Days = new Date(today.setDate(today.getDate() - 30))
                        setDateRange({
                          startDate: last30Days.toISOString().split('T')[0],
                          endDate: new Date().toISOString().split('T')[0],
                        })
                      }}
                      className="py-2 px-3 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg transition-all font-semibold"
                    >
                      Last 30 Days
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        const today = new Date()
                        const last90Days = new Date(today.setDate(today.getDate() - 90))
                        setDateRange({
                          startDate: last90Days.toISOString().split('T')[0],
                          endDate: new Date().toISOString().split('T')[0],
                        })
                      }}
                      className="py-2 px-3 text-xs bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded-lg transition-all font-semibold"
                    >
                      Last 90 Days
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        const today = new Date()
                        const startOfYear = new Date(today.getFullYear(), 0, 1)
                        setDateRange({
                          startDate: startOfYear.toISOString().split('T')[0],
                          endDate: today.toISOString().split('T')[0],
                        })
                      }}
                      className="py-2 px-3 text-xs bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 rounded-lg transition-all font-semibold"
                    >
                      This Year
                    </motion.button>
                  </div>
                </div>

                {/* Selected Range Summary */}
                <div className="bg-secondary-800/50 rounded-lg p-4 border border-white/10">
                  <p className="text-xs text-secondary-400 mb-2">Summary:</p>
                  <p className="text-sm text-white">
                    <span className="font-semibold">{dateRange.startDate}</span> → <span className="font-semibold">{dateRange.endDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowDateRangeModal(false)}
                  className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setShowDateRangeModal(false)
                    alert('✅ Date range updated! Reports are now filtered.')
                  }}
                  className="flex-1 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors"
                >
                  Apply Filter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowExpenseModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-secondary-900/90 border border-white/10 rounded-2xl p-8 w-full max-w-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Add Expense</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Category</label>
                  <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500">
                    <option>Material</option>
                    <option>Labour</option>
                    <option>Equipment</option>
                    <option>Transport</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Amount (₹)</label>
                  <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseInt(e.target.value) || 0 })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Date</label>
                  <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Description</label>
                  <input type="text" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="Add description..." className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowExpenseModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleAddExpense} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                  Add Expense
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
