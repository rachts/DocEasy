'use client'

import { useMemo } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Activity, HardDrive, Zap, FileText } from 'lucide-react'

type FileItem = {
  created_at: string
  tool_used: string
  original_size: number
  processed_size: number
}

interface AnalyticsClientProps {
  files: FileItem[]
}

const MONO_COLORS = ['#FAFAF9', '#D6D3D1', '#A8A29E', '#78716C', '#57534E', '#44403C']

export function AnalyticsClient({ files }: AnalyticsClientProps) {
  const stats = useMemo(() => {
    let totalFiles = files.length
    let originalTotal = 0
    let processedTotal = 0

    const toolCounts: Record<string, number> = {}
    const datesMap: Record<string, number> = {}

    // Last 7 days init
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      datesMap[dateStr] = 0
    }

    files.forEach((f) => {
      originalTotal += (f.original_size || 0)
      processedTotal += (f.processed_size || f.original_size || 0)

      if (!toolCounts[f.tool_used]) toolCounts[f.tool_used] = 0
      toolCounts[f.tool_used] += 1

      const dateStr = new Date(f.created_at).toISOString().split('T')[0]
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr] += 1
      }
    })

    const storageSaved = Math.max(0, originalTotal - processedTotal)
    
    const pieData = Object.keys(toolCounts).map((key) => ({
      name: key,
      value: toolCounts[key]
    }))

    const barData = Object.keys(datesMap).map((date) => ({
      date: date.slice(5),
      count: datesMap[date]
    }))

    return {
      totalFiles,
      originalTotal: (originalTotal / (1024 * 1024)).toFixed(2),
      processedTotal: (processedTotal / (1024 * 1024)).toFixed(2),
      storageSaved: (storageSaved / (1024 * 1024)).toFixed(2),
      pieData,
      barData
    }
  }, [files])

  return (
    <div className="space-y-8 font-sans">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1C1917] border border-[#292524] p-5 rounded-[8px]">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] mb-2">
            <span>EXECUTIONS</span>
            <FileText className="w-3.5 h-3.5 text-[#A8A29E]" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-[#FAFAF9]">{stats.totalFiles}</div>
          <p className="font-mono text-[11px] text-[#57534E] mt-1">LIFETIME ACTIONS</p>
        </div>

        <div className="bg-[#1C1917] border border-[#292524] p-5 rounded-[8px]">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] mb-2">
            <span>VOLUME PROCESSED</span>
            <HardDrive className="w-3.5 h-3.5 text-[#A8A29E]" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-[#FAFAF9]">{stats.originalTotal} <span className="text-lg font-mono text-[#57534E]">MB</span></div>
          <p className="font-mono text-[11px] text-[#57534E] mt-1">INGESTED THROUGHPUT</p>
        </div>

        <div className="bg-[#1C1917] border border-[#292524] p-5 rounded-[8px]">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] mb-2">
            <span>BANDWIDTH SAVED</span>
            <Zap className="w-3.5 h-3.5 text-[#A8A29E]" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-[#FAFAF9]">{stats.storageSaved} <span className="text-lg font-mono text-[#57534E]">MB</span></div>
          <p className="font-mono text-[11px] text-[#57534E] mt-1">QUANTIZATION DELTA</p>
        </div>

        <div className="bg-[#1C1917] border border-[#292524] p-5 rounded-[8px]">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.05em] text-[#57534E] mb-2">
            <span>ACTIVE TOOLS</span>
            <Activity className="w-3.5 h-3.5 text-[#A8A29E]" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-[#FAFAF9]">{stats.pieData.length}</div>
          <p className="font-mono text-[11px] text-[#57534E] mt-1">DIFFERENT TOOLS</p>
        </div>
      </div>

      {/* Chart Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
          <div className="border-b border-[#292524] pb-3 mb-6">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              7-Day Execution Trajectory
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="date" stroke="#57534E" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#57534E" tick={{ fontSize: 11, fontFamily: 'monospace' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141110', borderColor: '#292524', borderRadius: '6px', color: '#FAFAF9', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#FAFAF9" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1C1917] border border-[#292524] p-6 rounded-[8px]">
          <div className="border-b border-[#292524] pb-3 mb-6">
            <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#57534E]">
              Tool Usage Distribution
            </h2>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141110', borderColor: '#292524', borderRadius: '6px', color: '#FAFAF9', fontFamily: 'monospace', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="font-mono text-[12px] uppercase text-[#57534E]">
                No usage data recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
