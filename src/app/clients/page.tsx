'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Mail, Phone, MapPin, MoreVertical, X } from 'lucide-react'

const initialClients: any[] = []

export default function ClientsPage() {
  const router = useRouter()
  const [clientList, setClientList] = useState(initialClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active',
  })

  const handleAddClient = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('⚠️ Please fill all required fields')
      return
    }

    const newClient = {
      id: Math.max(...clientList.map(c => c.id)) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      projects: 0,
      totalSpent: 0,
      status: formData.status,
    }

    setClientList([...clientList, newClient])
    setFormData({ name: '', email: '', phone: '', address: '', company: '', status: 'active' })
    setShowModal(false)
    alert('✅ Client added successfully!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Clients</h1>
              <p className="text-secondary-400">Manage client information and projects</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Client
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-sm rounded-xl"
            />
          </div>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {clientList.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(`/clients/${client.id}`)}
              className="card group hover:shadow-glow cursor-pointer transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                  <p className="text-secondary-400 text-sm">{client.projects} active projects</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 hover:bg-secondary-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-secondary-400" />
                </motion.button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-secondary-300">
                  <Mail className="w-4 h-4 text-primary-400" />
                  <a href={`mailto:${client.email}`} className="hover:text-white transition-colors">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-secondary-300">
                  <Phone className="w-4 h-4 text-accent-400" />
                  <a href={`tel:${client.phone}`} className="hover:text-white transition-colors">
                    {client.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-secondary-300">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span>{client.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-400 text-xs mb-1">Total Investment</p>
                    <p className="text-xl font-bold text-white">
                      ₹{(client.totalSpent / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    client.status === 'active'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Client Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="card max-w-2xl w-full relative"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-secondary-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-6">Add New Client</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2">
                    <label className="block text-sm text-secondary-300 mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Skyline Developers"
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@company.com"
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-secondary-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Pvt Ltd"
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-secondary-300 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Business Ave, Downtown"
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-secondary-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full glass-sm rounded-lg px-4 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-secondary-700 text-secondary-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleAddClient}
                    className="flex-1 btn-primary rounded-lg"
                  >
                    Add Client
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
