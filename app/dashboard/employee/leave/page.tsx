"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutDashboard, Clock, FileText, Bell, Plus } from "lucide-react";
import { api } from "@/lib/api";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
  { title: "My Attendance History", href: "/dashboard/employee/history", icon: Clock },
  { title: "Leave Requests", href: "/dashboard/employee/leave", icon: FileText, active: true },
  { title: "Notifications", href: "/dashboard/employee/notifications", icon: Bell },
];

type LeaveRequest = {
  id: number;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
};

type NewLeave = {
  type: string;
  reason: string;
  start_date: string;
  end_date: string;
};

export default function LeaveRequestsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form data
  const [form, setForm] = useState<NewLeave>({
    type: "",
    reason: "",
    start_date: "",
    end_date: "",
  });

  // Fetch leaves on mount
  useEffect(() => {
    api<LeaveRequest[]>("/leave/my")
      .then(setLeaveRequests)
      .catch(() => setLeaveRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      Approved: "default",
      Pending: "secondary",
      Rejected: "destructive",
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
        {status}
      </Badge>
    );
  };

  // Submit leave request
  async function submitLeave() {
    if (!form.type || !form.start_date || !form.end_date || !form.reason) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const res = await api<LeaveRequest>("/leave/request", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setLeaveRequests((prev) => [res, ...prev]);
      setForm({ type: "", reason: "", start_date: "", end_date: "" });
      setIsDialogOpen(false);
      alert("Leave request submitted successfully!");
    } catch (err) {
      alert("Failed to submit leave request.");
    }
  }

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="John Doe" userEmail="john.doe@company.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Leave Requests</h1>
            <p className="text-muted-foreground">Manage your leave requests and view their status.</p>
          </div>

          {/* New Request Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
                <DialogDescription>Fill out the form to request time off.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(val) => setForm((f) => ({ ...f, type: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Vacation">Vacation</SelectItem>
                      <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    type="date"
                    id="start-date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    type="date"
                    id="end-date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={form.reason}
                    onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitLeave}>Submit Request</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Leave Requests</CardTitle>
            <CardDescription>Track the status of your submitted leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground p-4">Loading...</div>
            ) : leaveRequests.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/40">
                No leave requests yet.
              </div>
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{request.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.start_date).toLocaleDateString()} →{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{request.reason}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
