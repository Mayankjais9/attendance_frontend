"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceMarking } from "@/components/attendance-marking"
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Activity,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
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
    active: true,
  },
]

const securityLogs = [
  {
    id: 1,
    timestamp: "2024-01-25 09:15:23",
    user: "john.smith@company.com",
    action: "Login",
    ip: "192.168.1.45",
    status: "Success",
    device: "Chrome on Windows",
    location: "New York, NY",
  },
  {
    id: 2,
    timestamp: "2024-01-25 08:45:12",
    user: "sarah.johnson@company.com",
    action: "Login",
    ip: "192.168.1.32",
    status: "Success",
    device: "Safari on macOS",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    timestamp: "2024-01-25 08:30:45",
    user: "unknown@company.com",
    action: "Failed Login",
    ip: "203.0.113.42",
    status: "Failed",
    device: "Chrome on Linux",
    location: "Unknown",
  },
  {
    id: 4,
    timestamp: "2024-01-25 07:20:15",
    user: "mike.chen@company.com",
    action: "Password Change",
    ip: "192.168.1.67",
    status: "Success",
    device: "Firefox on Windows",
    location: "Chicago, IL",
  },
  {
    id: 5,
    timestamp: "2024-01-25 06:15:30",
    user: "admin@company.com",
    action: "User Created",
    ip: "192.168.1.10",
    status: "Success",
    device: "Chrome on macOS",
    location: "Boston, MA",
  },
]

const systemLogs = [
  {
    id: 1,
    timestamp: "2024-01-25 09:30:00",
    level: "INFO",
    service: "Database",
    message: "Database backup completed successfully",
    details: "Backup size: 2.3GB, Duration: 45 seconds",
  },
  {
    id: 2,
    timestamp: "2024-01-25 09:15:00",
    level: "WARNING",
    service: "Storage",
    message: "Storage usage above 80%",
    details: "Current usage: 85% (850GB/1TB)",
  },
  {
    id: 3,
    timestamp: "2024-01-25 09:00:00",
    level: "INFO",
    service: "API",
    message: "API service restarted",
    details: "Restart reason: Scheduled maintenance",
  },
  {
    id: 4,
    timestamp: "2024-01-25 08:45:00",
    level: "ERROR",
    service: "Email",
    message: "Failed to send notification email",
    details: "SMTP connection timeout after 30 seconds",
  },
  {
    id: 5,
    timestamp: "2024-01-25 08:30:00",
    level: "INFO",
    service: "Auth",
    message: "Session cleanup completed",
    details: "Cleaned 127 expired sessions",
  },
]

const auditLogs = [
  {
    id: 1,
    timestamp: "2024-01-25 09:20:00",
    user: "admin@company.com",
    action: "User Role Changed",
    target: "john.smith@company.com",
    oldValue: "Employee",
    newValue: "Manager",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    timestamp: "2024-01-25 09:10:00",
    user: "lisa.hr@company.com",
    action: "Leave Request Approved",
    target: "sarah.johnson@company.com",
    oldValue: "Pending",
    newValue: "Approved",
    ip: "192.168.1.25",
  },
  {
    id: 3,
    timestamp: "2024-01-25 09:05:00",
    user: "admin@company.com",
    action: "System Settings Updated",
    target: "Attendance Policy",
    oldValue: "Late threshold: 10 min",
    newValue: "Late threshold: 15 min",
    ip: "192.168.1.10",
  },
  {
    id: 4,
    timestamp: "2024-01-25 08:55:00",
    user: "alex.manager@company.com",
    action: "Employee Data Exported",
    target: "Team Report",
    oldValue: null,
    newValue: "CSV Export",
    ip: "192.168.1.18",
  },
]

export default function AdminLogsPage() {
  const [selectedTab, setSelectedTab] = useState("security")
  const [searchTerm, setSearchTerm] = useState("")
  const [logLevel, setLogLevel] = useState("all")
  const [timeRange, setTimeRange] = useState("today")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      INFO: "default",
      WARNING: "secondary",
      ERROR: "destructive",
      DEBUG: "outline",
    } as const

    return (
      <Badge variant={variants[level as keyof typeof variants] || "default"} className="text-xs">
        {level}
      </Badge>
    )
  }

  const handleExportLogs = (type: string) => {
    console.log(`Exporting ${type} logs`)
    // Handle log export logic here
  }

  const filteredSecurityLogs = securityLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm),
  )

  const filteredSystemLogs = systemLogs.filter(
    (log) =>
      (logLevel === "all" || log.level === logLevel) &&
      (log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredAuditLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Super Admin" userEmail="admin@company.com">
      <div className="space-y-6">
        <AttendanceMarking userName="Super Admin" userRole="Admin" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">System Logs</h1>
            <p className="text-muted-foreground">Monitor system activity, security events, and audit trails.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExportLogs("all")}>
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityLogs.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemLogs.filter((log) => log.level === "ERROR").length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityLogs.filter((log) => log.status === "Failed").length}</div>
              <p className="text-xs text-muted-foreground">Security alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">Uptime today</p>
            </CardContent>
          </Card>
        </div>

        {/* Logs Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">Security Logs</TabsTrigger>
            <TabsTrigger value="system">System Logs</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {selectedTab === "system" && (
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="INFO">Info</SelectItem>
                      <SelectItem value="WARNING">Warning</SelectItem>
                      <SelectItem value="ERROR">Error</SelectItem>
                      <SelectItem value="DEBUG">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Authentication attempts, login events, and security alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSecurityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-sm">{log.ip}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.device}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
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

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Events</CardTitle>
                <CardDescription>Application logs, errors, and system status messages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSystemLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                        <TableCell>{getLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-medium">{log.service}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>User actions, data changes, and administrative activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.target}</TableCell>
                        <TableCell className="text-sm">
                          {log.oldValue && log.newValue ? (
                            <div>
                              <span className="text-destructive line-through">{log.oldValue}</span>
                              {" → "}
                              <span className="text-chart-1">{log.newValue}</span>
                            </div>
                          ) : (
                            log.newValue
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.ip}</TableCell>
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
  )
}
