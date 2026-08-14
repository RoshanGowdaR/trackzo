'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { motion } from 'framer-motion'
import { Save, Moon, Sun, Database } from 'lucide-react'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-secondary-400">Application settings and preferences</p>
        </motion.div>

        {/* Company Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-300 mb-2">Company Name</label>
              <input type="text" defaultValue="BuildFlow Construction" className="w-full glass-sm rounded-xl px-4 py-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Email</label>
                <input type="email" defaultValue="admin@buildflow.com" className="w-full glass-sm rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">Phone</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full glass-sm rounded-xl px-4 py-3" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Theme & Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-accent-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <span className="text-white font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                {darkMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Database Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Backup & Restore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              suppressHydrationWarning
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 p-4 bg-secondary-800/50 hover:bg-secondary-700/50 rounded-lg transition-colors"
            >
              <Database className="w-5 h-5 text-primary-400" />
              <span className="text-white font-semibold">Backup Database</span>
            </motion.button>
            <motion.button
              suppressHydrationWarning
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 p-4 bg-secondary-800/50 hover:bg-secondary-700/50 rounded-lg transition-colors"
            >
              <Database className="w-5 h-5 text-accent-400" />
              <span className="text-white font-semibold">Restore Database</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          suppressHydrationWarning
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-semibold"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </motion.button>
      </div>
    </DashboardLayout>
  )
}
