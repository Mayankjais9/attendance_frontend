"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceMarking } from "@/components/attendance-marking";
import { api, downloadBase64File, type MeResponse } from "@/lib/api";
import { LayoutDashboard, Users, FileCheck, BarChart3, Download, Calendar } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
  { title: "Team Attendance", href: "/dashboard/manager/attendance", icon: Users },
  { title: "Approve Leaves", href: "/dashboard/manager/leaves", icon: FileCheck },
  { title: "Reports", href: "/dashboard/manager/reports", icon: BarChart3, active: true },
];

type ReportRow = {
  user_id: number;
  employee: string;
  email: string;
  department: string;
  present_days: number;
  absent_days: number;
};

type MonthlyReport = {
  month: string;
  rows: ReportRow[];
  summary: {
    employees: number;
    present_days: number;
    absent_days: number;
  };
};

type ExportPayload = {
  filename: string;
  mime_type: string;
  content_base64: string;
};

const currentMonth = new Date().toISOString().slice(0, 7);

export default function ManagerReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [userName, setUserName] = useState("Manager");
  const [userEmail, setUserEmail] = useState("manager@company.com");

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[manager-reports] failed to load profile", error));
  }, []);

  useEffect(() => {
    api<MonthlyReport>(`/reports/monthly?scope=team&month=${selectedMonth}`)
      .then(setReport)
      .catch((error) => {
        console.error("[manager-reports] failed to load report", error);
        setReport(null);
      });
  }, [selectedMonth]);

  const monthOptions = useMemo(() => {
    const options: string[] = [];
    const now = new Date();
    for (let offset = 0; offset < 6; offset += 1) {
      const value = new Date(now.getFullYear(), now.getMonth() - offset, 1).toISOString().slice(0, 7);
      options.push(value);
    }
    return options;
  }, []);

  const handleExport = async () => {
    try {
      const payload = await api<ExportPayload>(`/reports/export-xlsx?scope=team&month=${selectedMonth}`);
      await downloadBase64File(payload.filename, payload.content_base64, payload.mime_type);
    } catch (error) {
      console.error("[manager-reports] failed to export report", error);
    }
  };

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <AttendanceMarking userName={userName} userRole="Manager" />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Team Reports</h1>
            <p className="text-muted-foreground">Monthly attendance report backed by the real reports API.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export .xlsx
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{report?.summary.employees || 0}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <BarChart3 className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{report?.summary.present_days || 0}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <Calendar className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{report?.summary.absent_days || 0}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Team Report</CardTitle>
            <CardDescription>Each employee with present and absent day totals for {selectedMonth}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(report?.rows || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No report rows found.
                    </TableCell>
                  </TableRow>
                ) : (
                  report?.rows.map((row) => (
                    <TableRow key={row.user_id}>
                      <TableCell>{row.employee}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.present_days}</TableCell>
                      <TableCell>{row.absent_days}</TableCell>
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
