"use client"

import { useEffect, useState } from "react"
import RequireRole from "@/components/RequireRole"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AttendanceMarking } from "@/components/attendance-marking"
import { api } from "@/lib/api"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Search,
  UserCheck,
  FileText,
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard, active: true },
  { title: "Employee Records", href: "/dashboard/hr/employees", icon: Users },
  { title: "Reports", href: "/dashboard/hr/reports", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/hr/settings", icon: Settings },
]

type HRDashboardData = {
  total_employees: number
  active_today: number
  pending_leaves: number
  avg_attendance: number
  attendance_trends: { month: string; attendance: number }[]
  department_overview: { department: string; employees: number }[]
  employees: {
    id: number
    name: string
    email: string
    department: string
    status: string
    join_date: string | null
    attendance: number
  }[]
}

const initialData: HRDashboardData = {
  total_employees: 0,
  active_today: 0,
  pending_leaves: 0,
  avg_attendance: 0,
  attendance_trends: [],
  department_overview: [],
  employees: [],
}

export default function HRDashboard() {
  const [userName, setUserName] = useState("HR")
  const [userEmail, setUserEmail] = useState("hr@company.com")
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<HRDashboardData>(initialData)

  useEffect(() => {
    api<{ full_name?: string; email?: string }>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name)
        if (me.email) setUserEmail(me.email)
      })
      .catch(() => null)

    api<HRDashboardData>("/summary/hr-dashboard")
      .then(setData)
      .catch(() => setData(initialData))
  }, [])

  const filteredEmployees = data.employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <RequireRole allow={["HR", "Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
        <div className="space-y-6">
          <AttendanceMarking userName={userName} userRole="HR" />

          <div>
            <h1 className="text-3xl font-bold text-balance">HR Management Dashboard</h1>
            <p className="text-muted-foreground">Company-wide attendance and employee data from the live database.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.total_employees}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <UserCheck className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.active_today}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                <FileText className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.pending_leaves}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.avg_attendance}%</div></CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Recent attendance levels from real attendance rows</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.attendance_trends}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Active users grouped by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.department_overview.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No department data found.</div>
                ) : (
                  data.department_overview.map((department) => (
                    <div key={department.department} className="flex items-center justify-between">
                      <span className="text-sm">{department.department}</span>
                      <span className="font-semibold">{department.employees}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Employee Database</CardTitle>
                  <CardDescription>Live employee list with current-month attendance</CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search employees..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell><Badge variant="outline">{employee.status}</Badge></TableCell>
                      <TableCell>{employee.join_date ? new Date(employee.join_date).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>{employee.attendance}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}
