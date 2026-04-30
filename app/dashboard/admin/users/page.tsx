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
import { LayoutDashboard, Users, Settings, FileText, Search, Trash2, UserPlus, Shield, UserCheck, UserX, Edit } from "lucide-react";
import { api, type MeResponse } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Manage Users", href: "/dashboard/admin/users", icon: Users, active: true },
  { title: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
  { title: "Logs", href: "/dashboard/admin/logs", icon: FileText },
];

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  join_date?: string | null;
  last_activity?: string | null;
};

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  status: string;
};

const staticDepartments = ["Sales and BD", "Sourcing", "Execution", "Product", "Proposal", "HR"];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [departments, setDepartments] = useState<string[]>(staticDepartments);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@company.com");
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: staticDepartments[0],
    status: "active",
  });

  const loadUsers = () => {
    api<UserRow[]>("/users/manage")
      .then(setUsers)
      .catch((error) => {
        console.error("[admin-users] failed to load users", error);
        setUsers([]);
      });
  };

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[admin-users] failed to load profile", error));

    api<{ departments: string[] }>("/users/departments")
      .then((data) => setDepartments(data.departments?.length ? data.departments : staticDepartments))
      .catch((error) => {
        console.error("[admin-users] failed to load departments", error);
        setDepartments(staticDepartments);
      });

    loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const createUser = async () => {
    try {
      await api("/users/manage", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setIsAddUserOpen(false);
      setForm({ name: "", email: "", password: "", role: "employee", department: departments[0] || staticDepartments[0], status: "active" });
      loadUsers();
    } catch (error) {
      console.error("[admin-users] failed to create user", error);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    try {
      await api(`/users/manage/${selectedUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role.split(",")[0],
          department: selectedUser.department,
          status: selectedUser.status.toLowerCase(),
        }),
      });
      setIsEditUserOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error("[admin-users] failed to update user", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await api(`/users/manage/${userId}`, { method: "DELETE" });
      loadUsers();
    } catch (error) {
      console.error("[admin-users] failed to delete user", error);
    }
  };

  const getRoleBadge = (role: string) => {
    const primaryRole = role.split(",")[0].trim();
    const variants = {
      admin: "destructive",
      hr: "default",
      manager: "secondary",
      employee: "outline",
    } as const;

    return <Badge variant={variants[primaryRole as keyof typeof variants] || "outline"} className="text-xs capitalize">{role}</Badge>;
  };

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">User Management</h1>
            <p className="text-muted-foreground">Live add, edit, and delete operations against real user data.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.filter((u) => u.status === "Active").length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.filter((u) => u.role.includes("admin")).length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{users.filter((u) => u.status !== "Active").length}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Accounts</CardTitle>
                <CardDescription>Admin user CRUD connected to the backend APIs</CardDescription>
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
                    <DialogDescription>Create a real user account and assign a role.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Name</Label>
                      <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Password</Label>
                      <Input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Role</Label>
                      <Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Department</Label>
                      <Select value={form.department} onValueChange={(value) => setForm((prev) => ({ ...prev, department: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                    <Button onClick={createUser}>Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell><Badge variant="secondary">{user.status}</Badge></TableCell>
                    <TableCell>{user.join_date ? new Date(user.join_date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{user.last_activity ? new Date(user.last_activity).toLocaleString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsEditUserOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)} className="text-destructive hover:text-destructive">
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

        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update live user information.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select value={selectedUser.role.split(",")[0]} onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select value={selectedUser.department} onValueChange={(value) => setSelectedUser({ ...selectedUser, department: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={selectedUser.status.toLowerCase()} onValueChange={(value) => setSelectedUser({ ...selectedUser, status: value === "active" ? "Active" : "Inactive" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
              <Button onClick={updateUser}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
