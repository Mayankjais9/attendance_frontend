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
  BarChart3,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  UserCheck,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/hr",
    icon: LayoutDashboard,
    active: true,
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
  },
  {
    title: "Settings",
    href: "/dashboard/hr/settings",
    icon: Settings,
  },
]

// Mock data
const attendanceTrends = [
  { month: "Jul", attendance: 92, productivity: 88 },
  { month: "Aug", attendance: 89, productivity: 85 },
  { month: "Sep", attendance: 94, productivity: 91 },
  { month: "Oct", attendance: 91, productivity: 89 },
  { month: "Nov", attendance: 96, productivity: 93 },
  { month: "Dec", attendance: 93, productivity: 90 },
  { month: "Jan", attendance: 95, productivity: 92 },
]

const employees = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2022-03-15",
    status: "Active",
    avatar: "/placeholder.svg",
    attendance: 95,
    salary: "$85,000",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    joinDate: "2021-08-20",
    status: "Active",
    avatar: "/placeholder.svg",
    attendance: 92,
    salary: "$75,000",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    joinDate: "2023-01-10",
    status: "Active",
    avatar: "/placeholder.svg",
    attendance: 88,
    salary: "$70,000",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Design",
    position: "UX Designer",
    joinDate: "2022-11-05",
    status: "On Leave",
    avatar: "/placeholder.svg",
    attendance: 90,
    salary: "$68,000",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Sales",
    position: "Sales Representative",
    joinDate: "2023-06-12",
    status: "Active",
    avatar: "/placeholder.svg",
    attendance: 97,
    salary: "$55,000",
  },
]

const payrollSummary = {
  totalPayroll: "$1,245,000",
  avgSalary: "$73,235",
  totalEmployees: 17,
  payrollIncrease: "+5.2%",
}

export default function HRDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      "On Leave": "secondary",
      Inactive: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"} className="text-xs">
        {status}
      </Badge>
    )
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-chart-1"
    if (attendance >= 90) return "text-chart-5"
    return "text-destructive"
  }

  return (
    <RequireRole allow={["HR", "Admin"]}>
      <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Lisa HR" userEmail="lisa.hr@company.com">
        <div className="space-y-6">
          <AttendanceMarking userName="Lisa HR" userRole="HR Manager" />

          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">HR Management Dashboard</h1>
            <p className="text-muted-foreground">
              Manage employee records, track attendance trends, and oversee payroll.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Active workforce</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                <UserCheck className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollSummary.totalPayroll}</div>
                <p className="text-xs text-muted-foreground">Monthly budget</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payroll Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollSummary.payrollIncrease}</div>
                <p className="text-xs text-muted-foreground">Year over year</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employee Database</TabsTrigger>
              <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Attendance Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Trends</CardTitle>
                    <CardDescription>Company-wide attendance over the last 7 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
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
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Department Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Overview</CardTitle>
                    <CardDescription>Employee distribution by department</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                        <span className="text-sm">Engineering</span>
                      </div>
                      <span className="font-semibold">8 employees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                        <span className="text-sm">Marketing</span>
                      </div>
                      <span className="font-semibold">4 employees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                        <span className="text-sm">Sales</span>
                      </div>
                      <span className="font-semibold">3 employees</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                        <span className="text-sm">Design</span>
                      </div>
                      <span className="font-semibold">2 employees</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Employee Database</CardTitle>
                      <CardDescription>Manage employee records and information</CardDescription>
                    </div>
                    <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Employee
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Employee</DialogTitle>
                          <DialogDescription>Enter the employee details below.</DialogDescription>
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
                            <Label htmlFor="department" className="text-right">
                              Department
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-right">
                              Position
                            </Label>
                            <Input id="position" className="col-span-3" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsAddEmployeeOpen(false)}>Add Employee</Button>
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
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell>
                            <span className={getAttendanceColor(employee.attendance)}>{employee.attendance}%</span>
                          </TableCell>
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

            <TabsContent value="payroll" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Monthly payroll breakdown and statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Total Monthly Payroll</p>
                        <p className="text-2xl font-bold">{payrollSummary.totalPayroll}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Average Salary</p>
                        <p className="text-2xl font-bold">{payrollSummary.avgSalary}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">YoY Growth</p>
                        <p className="text-2xl font-bold text-chart-1">{payrollSummary.payrollIncrease}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Salary Distribution</CardTitle>
                    <CardDescription>Employee salary ranges by department</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Engineering</span>
                        <span className="text-sm font-medium">$65K - $95K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Marketing</span>
                        <span className="text-sm font-medium">$55K - $80K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sales</span>
                        <span className="text-sm font-medium">$45K - $70K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Design</span>
                        <span className="text-sm font-medium">$60K - $75K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}
