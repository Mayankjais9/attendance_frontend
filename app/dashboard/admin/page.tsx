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
  Settings,
  FileText,
  Activity,
  Search,
  Shield,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard, active: true },
  { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { title: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
  { title: "Logs", href: "/dashboard/admin/logs", icon: FileText },
]

type AdminDashboardData = {
  total_users: number
  active_users: number
  total_managers: number
  recent_activity: number
  role_distribution: { role: string; count: number }[]
  users: {
    id: number
    name: string
    email: string
    role: string
    department: string
    status: string
    last_activity: string | null
  }[]
  recent_logs: {
    id: number
    user: string
    action: string
    timestamp: string | null
    status: string
  }[]
}

const initialData: AdminDashboardData = {
  total_users: 0,
  active_users: 0,
  total_managers: 0,
  recent_activity: 0,
  role_distribution: [],
  users: [],
  recent_logs: [],
}

export default function AdminDashboard() {
  const [userName, setUserName] = useState("Admin")
  const [userEmail, setUserEmail] = useState("admin@company.com")
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<AdminDashboardData>(initialData)

  useEffect(() => {
    api<{ full_name?: string; email?: string }>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name)
        if (me.email) setUserEmail(me.email)
      })
      .catch(() => null)

    api<AdminDashboardData>("/summary/admin-dashboard")
      .then(setData)
      .catch(() => setData(initialData))
  }, [])

  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <RequireRole allow={["Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
        <div className="space-y-6">
          <AttendanceMarking userName={userName} userRole="Admin" />

          <div>
            <h1 className="text-3xl font-bold text-balance">System Administration</h1>
            <p className="text-muted-foreground">Live user, role, and audit activity from the production database.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.total_users}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.active_users}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Managers</CardTitle>
                <Shield className="h-4 w-4 text-chart-5" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.total_managers}</div></CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity (24h)</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.recent_activity}</div></CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>Users grouped by assigned role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.role_distribution.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No role data found.</div>
                ) : (
                  data.role_distribution.map((item) => (
                    <div key={item.role} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{item.role}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Logs</CardTitle>
                <CardDescription>Latest API-side audit events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recent_logs.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No audit logs found.</div>
                ) : (
                  data.recent_logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="rounded-lg border p-3">
                      <div className="font-medium text-sm">{log.user}</div>
                      <div className="text-sm text-muted-foreground">{log.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}
                      </div>
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
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Live user directory with role and department data</CardDescription>
                </div>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell><Badge variant="secondary">{user.status}</Badge></TableCell>
                      <TableCell>{user.last_activity ? new Date(user.last_activity).toLocaleString() : "-"}</TableCell>
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
