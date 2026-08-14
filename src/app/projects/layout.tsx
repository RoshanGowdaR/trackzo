'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Briefcase, Edit2, Trash2, Check, CheckCircle2 } from 'lucide-react'
import { useProjectStore, type Project } from '@/store/useProjectStore'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { projects, selectedProjectId, setSelectedProjectId, addProject, updateProject, deleteProject, loadFromStorage, getProjectById } = useProjectStore()
  const [mounted, setMounted] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [progressValue, setProgressValue] = useState(0)

  React.useEffect(() => {
    loadFromStorage()
    setMounted(true)
  }, [loadFromStorage])
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    budget: '',
    status: 'upcoming',
  })

  const handleCreateProject = () => {
    if (!formData.name.trim()) {
      alert('⚠️ Please enter project name')
      return
    }
    if (!formData.client_name.trim()) {
      alert('⚠️ Please enter client name')
      return
    }

    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      name: formData.name,
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      owner: formData.client_name,
      ownerPhone: formData.client_phone,
      address: '',
      length: 0,
      width: 0,
      area: 0,
      status: formData.status as 'completed' | 'running' | 'upcoming',
      progress: 0,
      budget: parseFloat(formData.budget) || 0,
      expenses: 0,
      materialCost: 0,
      labourCost: 0,
      materials: [],
      expenseDetails: [],
    }

    addProject(newProject)
    setFormData({ name: '', client_name: '', client_email: '', client_phone: '', budget: '', status: 'upcoming' })
    setShowNewProjectModal(false)
    alert('✅ Project created successfully!')
  }

  const handleCloseModal = () => {
    setShowNewProjectModal(false)
    setFormData({ name: '', client_name: '', client_email: '', client_phone: '', budget: '', status: 'upcoming' })
  }

  const handleEditClick = (project: Project) => {
    setEditingProjectId(project.id)
    setFormData({
      name: project.name,
      client_name: project.client_name,
      client_email: project.client_email || '',
      client_phone: project.client_phone || '',
      budget: project.budget.toString(),
      status: project.status,
    })
    setShowEditModal(true)
  }

  const handleUpdateProject = () => {
    if (!editingProjectId || !formData.name.trim() || !formData.client_name.trim()) {
      alert('⚠️ Please fill in required fields')
      return
    }

    const updatedProject = {
      ...getProjectById(editingProjectId)!,
      name: formData.name,
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      budget: parseFloat(formData.budget) || 0,
      status: formData.status as 'completed' | 'running' | 'upcoming',
    }

    updateProject(editingProjectId, updatedProject)
    setEditingProjectId(null)
    setShowEditModal(false)
    setFormData({ name: '', client_name: '', client_email: '', client_phone: '', budget: '', status: 'upcoming' })
    alert('✅ Project updated successfully!')
  }

  const handleDeleteClick = (projectId: number) => {
    setEditingProjectId(projectId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (!editingProjectId) return
    deleteProject(editingProjectId)
    setShowDeleteConfirm(false)
    setEditingProjectId(null)
    alert('✅ Project deleted successfully!')
  }

  const handleMarkComplete = (projectId: number) => {
    const project = getProjectById(projectId)
    if (!project) return

    updateProject(projectId, {
      status: 'completed',
      progress: 100,
      endDate: new Date().toISOString().split('T')[0],
    })
    alert('✅ Project marked as complete!')
  }

  const handleOpenProgressModal = (projectId: number) => {
    const project = getProjectById(projectId)
    if (!project) return

    setEditingProjectId(projectId)
    setProgressValue(project.progress)
    setShowProgressModal(true)
  }

  const handleUpdateProgress = () => {
    if (!editingProjectId) return

    const newStatus = progressValue === 100 ? 'completed' : 'running'
    const endDate = progressValue === 100 ? new Date().toISOString().split('T')[0] : undefined

    updateProject(editingProjectId, {
      progress: progressValue,
      status: newStatus,
      ...(endDate && { endDate }),
    })

    setShowProgressModal(false)
    setEditingProjectId(null)
    alert('✅ Progress updated successfully!')
  }

  return (
    <DashboardLayout>
      <div className="flex gap-4 h-full">
        {/* Projects List Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0 bg-secondary-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-120px)]"
        >
          <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewProjectModal(true)}
            className="w-full mb-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>

          <div suppressHydrationWarning className="space-y-3">
            {mounted && projects.map(project => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg transition-all border ${
                  selectedProjectId === project.id
                    ? 'bg-primary-600/30 border-primary-500/50'
                    : 'bg-secondary-800/50 border-secondary-700/50 hover:bg-secondary-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedProjectId(project.id)}>
                    <p className="font-semibold text-white truncate">{project.name}</p>
                    <p className="text-xs text-secondary-400 truncate mt-1">{project.client_name}</p>
                  </div>
                  <div className="flex gap-2">
                    {project.status !== 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkComplete(project.id)
                        }}
                        className="p-1.5 hover:bg-green-500/20 rounded text-green-400 hover:text-green-300 transition-all"
                        title="Mark as complete"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(project)
                      }}
                      className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-all"
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(project.id)
                      }}
                      className="p-1.5 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-all"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                      project.status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : project.status === 'running'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {project.status === 'completed' && <Check className="w-3 h-3" />}
                      {project.status}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    project.progress === 100 ? 'text-green-400' : 'text-secondary-400'
                  }`}>
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-secondary-700 rounded-full overflow-hidden cursor-pointer" onClick={() => handleOpenProgressModal(project.id)}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className={`h-full ${
                        project.progress === 100
                          ? 'bg-gradient-to-r from-green-600 to-green-400'
                          : 'bg-gradient-to-r from-primary-600 to-accent-600'
                      }`}
                    />
                  </div>
                  {project.status !== 'completed' && (
                    <p className="text-xs text-secondary-400 cursor-pointer hover:text-secondary-300" onClick={() => handleOpenProgressModal(project.id)}>
                      Click to update progress
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {children}
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-secondary-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-md backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Create New Project</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleCloseModal}
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Enter client name"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Email</label>
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Phone</label>
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="+91-98765432"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Enter budget"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCreateProject}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-secondary-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-md backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Edit Project</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowEditModal(false)}
                  className="text-secondary-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Enter client name"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Email</label>
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Client Phone</label>
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="+91-98765432"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Enter budget"
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-secondary-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-secondary-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleUpdateProject}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-secondary-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-sm backdrop-blur-xl"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Delete Project?</h3>
                <p className="text-secondary-400">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Update Modal */}
      <AnimatePresence>
        {showProgressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProgressModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-secondary-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-sm backdrop-blur-xl"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Update Progress</h3>
                <p className="text-secondary-400 text-sm">Set completion percentage for this project</p>
              </div>

              <div className="space-y-6">
                {/* Progress Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm text-secondary-300">Completion</label>
                    <span className={`text-2xl font-bold ${
                      progressValue === 100 ? 'text-green-400' : 'text-primary-400'
                    }`}>
                      {progressValue}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={(e) => setProgressValue(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${progressValue === 100 ? '#22c55e' : '#2563eb'} 0%, ${progressValue === 100 ? '#22c55e' : '#2563eb'} ${progressValue}%, #334155 ${progressValue}%, #334155 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-secondary-400 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Quick Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 75].map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setProgressValue(value)}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        progressValue === value
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-800 text-secondary-300 hover:bg-secondary-700'
                      }`}
                    >
                      {value}%
                    </motion.button>
                  ))}
                </div>

                {/* Status Info */}
                <div className="bg-secondary-800/50 rounded-lg p-3">
                  <p className="text-xs text-secondary-400">
                    {progressValue < 100
                      ? `Project status will be set to "running" at ${progressValue}% completion`
                      : '✓ Project will be marked as "completed" when saved'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 px-4 py-2.5 border border-secondary-700 text-secondary-300 hover:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleUpdateProgress}
                  className={`flex-1 text-white rounded-lg font-medium transition-colors ${
                    progressValue === 100
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {progressValue === 100 ? 'Complete Project' : 'Update Progress'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
