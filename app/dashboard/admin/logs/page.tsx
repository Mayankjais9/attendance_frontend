"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Users, Settings, FileText, Search, AlertTriangle, Activity } from "lucide-react";
import { api, type MeResponse } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
  { title: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
  { title: "Logs", href: "/dashboard/admin/logs", icon: FileText, active: true },
];

type LogRow = {
  id: number;
  timestamp: string | null;
  user: string;
  action: string;
  status: string;
};

export default function AdminLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@company.com");

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[admin-logs] failed to load profile", error));
  }, []);

  useEffect(() => {
    api<LogRow[]>(`/users/logs?limit=200&search=${encodeURIComponent(searchTerm)}`)
      .then(setLogs)
      .catch((error) => {
        console.error("[admin-logs] failed to load logs", error);
        setLogs([]);
      });
  }, [searchTerm]);

  const failedCount = useMemo(() => logs.filter((log) => log.action.toLowerCase().includes("failed")).length, [logs]);

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">System Logs</h1>
          <p className="text-muted-foreground">Real audit log data from the backend logs API.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{logs.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{failedCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{logs.slice(0, 10).length}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Only live API data, no dummy log rows</CardDescription>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.status}</TableCell>
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
