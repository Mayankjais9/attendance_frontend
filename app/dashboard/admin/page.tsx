"use client"

import RequireRole from "@/components/RequireRole"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceMarking } from "@/components/attendance-marking"
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Activity,
  Server,
  Database,
  Search,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "System Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
  {
    title: "Logs",
    href: "/dashboard/admin/logs",
    icon: FileText,
  },
]

// Mock data
const systemStats = {
  totalUsers: 47,
  activeUsers: 42,
  totalManagers: 8,
  systemUptime: "99.9%",
  lastBackup: "2 hours ago",
  storageUsed: "68%",
}

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "employee",
    department: "Engineering",
    status: "Active",
    lastLogin: "2024-01-25 09:15",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "manager",
    department: "Marketing",
    status: "Active",
    lastLogin: "2024-01-25 08:45",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "employee",
    department: "Engineering",
    status: "Active",
    lastLogin: "2024-01-25 09:30",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Lisa HR",
    email: "lisa.hr@company.com",
    role: "hr",
    department: "Human Resources",
    status: "Active",
    lastLogin: "2024-01-25 08:30",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Alex Manager",
    email: "alex.manager@company.com",
    role: "admin",
    department: "Management",
    status: "Active",
    lastLogin: "2024-01-25 07:45",
    avatar: "/placeholder.svg",
  },
]

const securityLogs = [
  {
    id: 1,
    user: "john.smith@company.com",
    action: "Login",
    timestamp: "2024-01-25 09:15:23",
    ip: "192.168.1.45",
    status: "Success",
    device: "Chrome on Windows",
  },
  {
    id: 2,
    user: "sarah.johnson@company.com",
    action: "Login",
    timestamp: "2024-01-25 08:45:12",
    ip: "192.168.1.32",
    status: "Success",
    device: "Safari on macOS",
  },
  {
    id: 3,
    user: "unknown@company.com",
    action: "Failed Login",
    timestamp: "2024-01-25 08:30:45",
    ip: "203.0.113.42",
    status: "Failed",
    device: "Chrome on Linux",
  },
  {
    id: 4,
    user: "mike.chen@company.com",
    action: "Password Change",
    timestamp: "2024-01-25 07:20:15",
    ip: "192.168.1.67",
    status: "Success",
    device: "Firefox on Windows",
  },
  {
    id: 5,
    user: "lisa.hr@company.com",
    action: "Login",
    timestamp: "2024-01-25 08:30:00",
    ip: "192.168.1.28",
    status: "Success",
    device: "Chrome on macOS",
  },
]

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      hr: "default",
      manager: "secondary",
      employee: "outline",
    } as const

    return (
      <Badge variant={variants[role as keyof typeof variants] || "outline"} className="text-xs capitalize">
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Inactive: "secondary",
      Suspended: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"} className="text-xs">
        {status}
      </Badge>
    )
  }

  const getLogStatusIcon = (status: string) => {
    if (status === "Success") {
      return <CheckCircle className="h-4 w-4 text-chart-1" />
    }
    return <AlertTriangle className="h-4 w-4 text-destructive" />
  }

  return (
    <RequireRole allow={["Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Super Admin" userEmail="admin@company.com">
        <div className="space-y-6">
          <AttendanceMarking userName="Super Admin" userRole="Admin" />

          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">System Administration</h1>
            <p className="text-muted-foreground">Monitor system health, manage users, and review security logs.</p>
          </div>

          {/* System Overview Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">{systemStats.activeUsers} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">of 1TB capacity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.lastBackup}</div>
                <p className="text-xs text-muted-foreground">Automated daily</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="logs">Security Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Role Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Role Distribution</CardTitle>
                    <CardDescription>User roles across the system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                        <span className="text-sm">Employees</span>
                      </div>
                      <span className="font-semibold">32 users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                        <span className="text-sm">Managers</span>
                      </div>
                      <span className="font-semibold">8 users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                        <span className="text-sm">HR</span>
                      </div>
                      <span className="font-semibold">4 users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">Admins</span>
                      </div>
                      <span className="font-semibold">3 users</span>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Current system status and metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-chart-1" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-chart-1" />
                        <span className="text-sm">API Services</span>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-chart-5" />
                        <span className="text-sm">Storage</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Warning
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-chart-1" />
                        <span className="text-sm">Backup System</span>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts and assign roles</CardDescription>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>Create a new user account and assign role.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input id="name" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input id="email" type="email" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="hr">HR</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                              Department
                            </Label>
                            <Input id="department" className="col-span-3" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsAddUserOpen(false)}>Create User</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Logs</CardTitle>
                  <CardDescription>Recent system access and security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                          <TableCell className="text-sm">{log.ip}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.device}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getLogStatusIcon(log.status)}
                              <span className="text-sm">{log.status}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}




