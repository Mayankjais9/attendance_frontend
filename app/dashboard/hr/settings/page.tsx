"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, Users, BarChart3, Settings, Save, Clock, Bell, Shield } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/hr",
    icon: <LayoutDashboard className="h-4 w-4" />,
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
    active: true,
  },
]

export default function SettingsPage() {
  const [workingHours, setWorkingHours] = useState({
    startTime: "09:00",
    endTime: "17:00",
    lunchBreak: "60",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lateArrivalAlerts: true,
    absenceAlerts: true,
    weeklyReports: true,
  })

  const [policies, setPolicies] = useState({
    graceTime: "15",
    maxLateArrivals: "3",
    leaveApprovalRequired: true,
    overtimeTracking: true,
  })

  const handleSave = () => {
    console.log("Settings saved:", { workingHours, notifications, policies })
    // Handle save logic here
  }

  return (
    <DashboardLayout sidebar={<SidebarNav items={sidebarItems} />} userName="Lisa HR" userEmail="lisa.hr@company.com">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">HR Settings</h1>
            <p className="text-muted-foreground">Configure attendance policies and system settings</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="working-hours" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="working-hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours Configuration
                </CardTitle>
                <CardDescription>Set standard working hours and break times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={workingHours.startTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={workingHours.endTime}
                      onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lunch-break">Lunch Break Duration (minutes)</Label>
                  <Select
                    value={workingHours.lunchBreak}
                    onValueChange={(value) => setWorkingHours({ ...workingHours, lunchBreak: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure email alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for attendance events</p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Late Arrival Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when employees arrive late</p>
                  </div>
                  <Switch
                    checked={notifications.lateArrivalAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lateArrivalAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Absence Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for unplanned absences</p>
                  </div>
                  <Switch
                    checked={notifications.absenceAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, absenceAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly attendance summary reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Attendance Policies
                </CardTitle>
                <CardDescription>Configure attendance rules and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grace-time">Grace Time (minutes)</Label>
                    <Select
                      value={policies.graceTime}
                      onValueChange={(value) => setPolicies({ ...policies, graceTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-late">Max Late Arrivals per Month</Label>
                    <Select
                      value={policies.maxLateArrivals}
                      onValueChange={(value) => setPolicies({ ...policies, maxLateArrivals: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 times</SelectItem>
                        <SelectItem value="3">3 times</SelectItem>
                        <SelectItem value="5">5 times</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Leave Approval Required</Label>
                    <p className="text-sm text-muted-foreground">Require manager approval for leave requests</p>
                  </div>
                  <Switch
                    checked={policies.leaveApprovalRequired}
                    onCheckedChange={(checked) => setPolicies({ ...policies, leaveApprovalRequired: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overtime Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track and calculate overtime hours</p>
                  </div>
                  <Switch
                    checked={policies.overtimeTracking}
                    onCheckedChange={(checked) => setPolicies({ ...policies, overtimeTracking: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
