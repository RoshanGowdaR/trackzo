'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SafeChartProps {
  options: any
  series: any
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap'
  height?: number | string
  width?: number | string
}

/**
 * Sanitize series to prevent ApexCharts math errors:
 * - 0 in donut/pie produces 0-degree arcs => floating point trigonometric precision limits (e.g. 2.14e-16) => invalid SVG path `M e -16`
 * - 0 in radialBar produces negative hollow radii
 * - NaN / undefined in series arrays produce NaN SVG attributes
 */
function sanitizeSeries(type: string, series: any): any {
  if (!series) return type === 'donut' || type === 'pie' || type === 'radialBar' ? [1] : []

  if (type === 'donut' || type === 'pie') {
    if (!Array.isArray(series) || series.length === 0) return [1]
    // If all values are 0 or empty, give a clean single slice
    const sum = series.reduce((acc: number, val: any) => acc + (Number(val) || 0), 0)
    if (sum === 0) {
      return series.map(() => 1)
    }
    // Replace any exact 0 with a tiny epsilon (0.0001) so ApexCharts doesn't generate 0-arc degenerate paths
    return series.map((val: any) => {
      const num = Number(val)
      if (isNaN(num) || num <= 0) return 0.0001
      return num
    })
  }

  if (type === 'radialBar') {
    if (!Array.isArray(series) || series.length === 0) return [0.1]
    return series.map((val: any) => {
      const num = Number(val)
      if (isNaN(num) || num <= 0) return 0.1
      return Math.min(100, Math.max(0.1, num))
    })
  }

  return series
}

export default function SafeChart({ options, series, type, height = 300, width = '100%' }: SafeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Delay mounting slightly (150ms) to ensure:
  // 1. DOM has completely rendered
  // 2. Framer Motion entrance animations (scale/translate/opacity) have initialized
  // 3. Parent container has computed valid positive width & height
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  const safeSeries = useMemo(() => sanitizeSeries(type, series), [type, series])

  const safeOptions = useMemo(() => {
    const base = options ? { ...options } : {}
    return {
      ...base,
      chart: {
        ...(base.chart || {}),
        type,
        width: '100%',
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 400,
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
          ...(base.chart?.animations || {}),
        },
      },
      stroke: {
        width: type === 'donut' || type === 'pie' ? 1 : (base.stroke?.width ?? 2),
        colors: base.stroke?.colors || (type === 'donut' || type === 'pie' ? ['transparent'] : undefined),
        ...(base.stroke || {}),
      },
    }
  }, [options, type])

  const numericHeight = typeof height === 'number' ? height : parseInt(String(height), 10) || 300

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: `${numericHeight}px`,
        height: `${numericHeight}px`,
        position: 'relative',
      }}
    >
      {mounted ? (
        <ApexChart
          options={safeOptions}
          series={safeSeries}
          type={type}
          height={numericHeight}
          width="100%"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: `${numericHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="animate-pulse bg-white/5 rounded-xl w-full h-full" />
        </div>
      )}
    </div>
  )
}
