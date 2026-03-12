"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
import { LayoutDashboard, Users, BarChart3, Settings, Search, Plus, Edit, Trash2 } from "lucide-react"

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
    active: true,
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
]

export default function EmployeeRecordsPage() {
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
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Lisa HR" userEmail="lisa.hr@company.com">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Employee Records</h1>
          <p className="text-muted-foreground">Manage employee information and records</p>
        </div>

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
      </div>
    </DashboardLayout>
  )
}
