"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutDashboard, Users, BarChart3, Settings, Search, Plus } from "lucide-react";
import { api, type MeResponse } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },
  { title: "Employee Records", href: "/dashboard/hr/employees", icon: Users, active: true },
  { title: "Reports", href: "/dashboard/hr/reports", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/hr/settings", icon: Settings },
];

const departmentOptions = ["Sales and BD", "Sourcing", "Execution", "Product", "Proposal", "HR"];

type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  join_date?: string | null;
  attendance?: number;
  role?: string;
};

type NewEmployeeForm = {
  name: string;
  email: string;
  password: string;
  department: string;
};

export default function EmployeeRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [userName, setUserName] = useState("HR");
  const [userEmail, setUserEmail] = useState("hr@company.com");
  const [form, setForm] = useState<NewEmployeeForm>({ name: "", email: "", password: "", department: departmentOptions[0] });

  const loadEmployees = () => {
    api<EmployeeRow[]>("/users/manage")
      .then((rows) => setEmployees(rows))
      .catch((error) => {
        console.error("[hr-employees] failed to load users", error);
        setEmployees([]);
      });
  };

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[hr-employees] failed to load profile", error));
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [employees, searchTerm]
  );

  const submitEmployee = async () => {
    try {
      await api("/users/manage", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          role: "employee",
          status: "active",
        }),
      });
      setIsAddEmployeeOpen(false);
      setForm({ name: "", email: "", password: "", department: departmentOptions[0] });
      loadEmployees();
    } catch (error) {
      console.error("[hr-employees] failed to add employee", error);
    }
  };

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Employee Records</h1>
          <p className="text-muted-foreground">Live employee list with add employee wired to the backend POST API.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Database</CardTitle>
                <CardDescription>Real users instead of dummy employee records</CardDescription>
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
                    <DialogDescription>Creates a real employee user in the database.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={form.department} onValueChange={(value) => setForm((prev) => ({ ...prev, department: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitEmployee}>Add Employee</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell><Badge variant="outline">{employee.role || "employee"}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{employee.status}</Badge></TableCell>
                      <TableCell>{employee.join_date ? new Date(employee.join_date).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>{employee.attendance ?? 0}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
