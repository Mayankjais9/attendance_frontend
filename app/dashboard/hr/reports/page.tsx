"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, Users, BarChart3, Settings, Download, Calendar, TrendingUp, UserCheck } from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, Bar, BarChart } from "recharts"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/hr",
    icon: LayoutDashboard,
  },
  {
    title: "Employee Records",
    href: "/dashboard/hr/employees",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/dashboard/hr/reports",
    icon: BarChart3,
    active: true,
  },
  {
    title: "Settings",
    href: "/dashboard/hr/settings",
    icon: Settings,
  },
]

const attendanceTrends = [
  { month: "Jul", attendance: 92, productivity: 88 },
  { month: "Aug", attendance: 89, productivity: 85 },
  { month: "Sep", attendance: 94, productivity: 91 },
  { month: "Oct", attendance: 91, productivity: 89 },
  { month: "Nov", attendance: 96, productivity: 93 },
  { month: "Dec", attendance: 93, productivity: 90 },
  { month: "Jan", attendance: 95, productivity: 92 },
]

const departmentData = [
  { department: "Engineering", employees: 12, avgAttendance: 94 },
  { department: "Marketing", employees: 8, avgAttendance: 91 },
  { department: "Sales", employees: 6, avgAttendance: 89 },
  { department: "Design", employees: 4, avgAttendance: 96 },
  { department: "HR", employees: 3, avgAttendance: 98 },
]

export default function ReportsPage() {
  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Lisa HR" userEmail="lisa.hr@company.com">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive attendance and performance reports</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <UserCheck className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Working Hours</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.4h</div>
              <p className="text-xs text-muted-foreground">Per employee daily</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.5%</div>
              <p className="text-xs text-muted-foreground">+1.8% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Calendar className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">-0.8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
            <TabsTrigger value="departments">Department Analysis</TabsTrigger>
            <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Month Attendance Trends</CardTitle>
                <CardDescription>Company-wide attendance and productivity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={attendanceTrends}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.2}
                      name="Attendance %"
                    />
                    <Area
                      type="monotone"
                      dataKey="productivity"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.2}
                      name="Productivity %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Attendance rates by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentData}>
                    <XAxis dataKey="department" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Bar dataKey="avgAttendance" fill="hsl(var(--chart-1))" name="Avg Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Highlights</CardTitle>
                  <CardDescription>Key achievements and metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Best Performing Department</p>
                      <p className="text-lg font-bold">HR Department</p>
                      <p className="text-xs text-muted-foreground">98% attendance rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Most Improved</p>
                      <p className="text-lg font-bold">Engineering</p>
                      <p className="text-xs text-muted-foreground">+3.2% improvement</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Perfect Attendance</p>
                      <p className="text-lg font-bold">8 Employees</p>
                      <p className="text-xs text-muted-foreground">100% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>Recommendations for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg border-chart-5/20 bg-chart-5/5">
                    <p className="text-sm font-medium">Sales Department</p>
                    <p className="text-xs text-muted-foreground">Consider flexible hours to improve attendance</p>
                  </div>
                  <div className="p-4 border rounded-lg border-chart-1/20 bg-chart-1/5">
                    <p className="text-sm font-medium">Late Arrivals</p>
                    <p className="text-xs text-muted-foreground">
                      Implement reminder system for consistent punctuality
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg border-chart-3/20 bg-chart-3/5">
                    <p className="text-sm font-medium">Recognition Program</p>
                    <p className="text-xs text-muted-foreground">Reward employees with perfect attendance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
