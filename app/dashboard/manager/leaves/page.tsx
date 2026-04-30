"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceMarking } from "@/components/attendance-marking";
import { api, type MeResponse } from "@/lib/api";
import { LayoutDashboard, Users, FileCheck, BarChart3, Search, CheckCircle, XCircle, Clock } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
  { title: "Team Attendance", href: "/dashboard/manager/attendance", icon: Users },
  { title: "Approve Leaves", href: "/dashboard/manager/leaves", icon: FileCheck, active: true },
  { title: "Reports", href: "/dashboard/manager/reports", icon: BarChart3 },
];

type LeaveRequest = {
  id: number;
  user_id: number;
  employee?: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at?: string | null;
};

export default function ManagerLeavesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [userName, setUserName] = useState("Manager");
  const [userEmail, setUserEmail] = useState("manager@company.com");

  const loadRequests = () => {
    api<LeaveRequest[]>("/leave/requests?scope=team")
      .then(setRequests)
      .catch((error) => {
        console.error("[manager-leaves] failed to load leave requests", error);
        setRequests([]);
      });
  };

  useEffect(() => {
    api<MeResponse>("/auth/me")
      .then((me) => {
        if (me.full_name) setUserName(me.full_name);
        if (me.email) setUserEmail(me.email);
      })
      .catch((error) => console.error("[manager-leaves] failed to load profile", error));
    loadRequests();
  }, []);

  const handleLeaveAction = async (leaveId: number, action: "approve" | "reject") => {
    try {
      setBusyId(leaveId);
      const updated = await api<LeaveRequest>(`/leave/${leaveId}/${action}`, { method: "POST" });
      setRequests((prev) => prev.map((item) => (item.id === leaveId ? updated : item)));
    } catch (error) {
      console.error(`[manager-leaves] failed to ${action} leave`, error);
    } finally {
      setBusyId(null);
    }
  };

  const filteredRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          (request.employee || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [requests, searchTerm]
  );

  const pendingCount = requests.filter((request) => request.status.toLowerCase() === "pending").length;
  const approvedCount = requests.filter((request) => request.status.toLowerCase() === "approved").length;

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const;

    return (
      <Badge variant={variants[normalized as keyof typeof variants] || "outline"} className="text-xs capitalize">
        {status}
      </Badge>
    );
  };

  const renderRequests = (items: LeaveRequest[]) =>
    items.length === 0 ? (
      <div className="text-sm text-muted-foreground">No leave requests found.</div>
    ) : (
      items.map((request) => (
        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg gap-4">
          <div className="space-y-1">
            <p className="font-medium">{request.employee || "Employee"}</p>
            <div className="text-sm text-muted-foreground">
              {request.type} | {new Date(request.start_date).toLocaleDateString()} -{" "}
              {new Date(request.end_date).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">{request.reason}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(request.status)}
            {request.status.toLowerCase() === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === request.id}
                  onClick={() => handleLeaveAction(request.id, "reject")}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" disabled={busyId === request.id} onClick={() => handleLeaveAction(request.id, "approve")}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      ))
    );

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <AttendanceMarking userName={userName} userRole="Manager" />

        <div>
          <h1 className="text-3xl font-bold text-balance">Leave Management</h1>
          <p className="text-muted-foreground">Review and approve live leave requests from your team.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{pendingCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{approvedCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{requests.length}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Connected to the real leave approval flow</CardDescription>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4">
                {renderRequests(filteredRequests.filter((request) => request.status.toLowerCase() === "pending"))}
              </TabsContent>
              <TabsContent value="approved" className="space-y-4">
                {renderRequests(filteredRequests.filter((request) => request.status.toLowerCase() === "approved"))}
              </TabsContent>
              <TabsContent value="all" className="space-y-4">
                {renderRequests(filteredRequests)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
