'use client'

import React, { useState, useEffect, useRef } from 'react'
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
 * SafeChart wraps react-apexcharts to prevent NaN SVG attribute errors.
 * 
 * Root cause: ApexCharts reads container.offsetWidth on mount to calculate
 * SVG dimensions. When the container is inside a Framer Motion animation
 * (opacity: 0, translateY, etc.) or hasn't been laid out yet by the browser,
 * offsetWidth returns 0. ApexCharts then computes 0-based math that produces
 * NaN for translate(), width, height, arc paths, and circle radii.
 *
 * Fix: Use a ResizeObserver to wait until the container has a real non-zero
 * width before rendering the chart. This guarantees ApexCharts always gets
 * valid dimensions.
 */
export default function SafeChart({ options, series, type, height = 300, width }: SafeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Check immediately - if already laid out, render right away
    if (el.offsetWidth > 0) {
      setReady(true)
      return
    }

    // Otherwise, watch for when the container gets a real width
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) {
          setReady(true)
          observer.disconnect()
        }
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ minHeight: typeof height === 'number' ? height : undefined }}>
      {ready && (
        <ApexChart
          options={options}
          series={series}
          type={type}
          height={height}
          width={width}
        />
      )}
    </div>
  )
}
