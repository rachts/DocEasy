"use client"

import { useMemo } from "react"
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
  Cell,
  Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, HardDrive, Zap, FileIcon } from "lucide-react"

type FileItem = {
  created_at: string
  tool_used: string
  original_size: number
  processed_size: number
}

interface AnalyticsClientProps {
  files: FileItem[]
}

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2']

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

    files.forEach(f => {
      originalTotal += (f.original_size || 0)
      processedTotal += (f.processed_size || f.original_size || 0)

      // Tool count
      if (!toolCounts[f.tool_used]) toolCounts[f.tool_used] = 0
      toolCounts[f.tool_used] += 1

      // Date count
      const dateStr = new Date(f.created_at).toISOString().split('T')[0]
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr] += 1
      }
    })

    const storageSaved = Math.max(0, originalTotal - processedTotal)
    
    const pieData = Object.keys(toolCounts).map(key => ({
      name: key,
      value: toolCounts[key]
    }))

    const barData = Object.keys(datesMap).map(date => {
      const parts = date.split('-')
      return {
        date: `${parts[1]}/${parts[2]}`,
        files: datesMap[date]
      }
    })

    return {
      totalFiles,
      storageSaved,
      pieData,
      barData
    }
  }, [files])

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files Processed</CardTitle>
            <FileIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all tools</p>
          </CardContent>
        </Card>
        <Card className="bg-card hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Saved</CardTitle>
            <HardDrive className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatSize(stats.storageSaved)}</div>
            <p className="text-xs text-muted-foreground mt-1">Via compression tools</p>
          </CardContent>
        </Card>
        <Card className="bg-card hover:border-purple-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tasks Completed</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pieData.filter(d => d.name.includes('AI') || d.name.includes('Analyzer') || d.name.includes('Summarizer')).reduce((acc, curr) => acc + curr.value, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Documents analyzed</p>
          </CardContent>
        </Card>
        <Card className="bg-card hover:border-orange-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.barData.reduce((acc, curr) => acc + curr.files, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Files in last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Files processed per day over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                  />
                  <Bar dataKey="files" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle>Tool Usage</CardTitle>
            <CardDescription>
              Breakdown of the tools you use most.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Activity className="w-8 h-8 mb-2 opacity-20" />
                  <p>No tools used yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
