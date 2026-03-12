"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081"

interface AttendanceMarkingProps {
  userName?: string
  userRole?: string
  currentDate?: string
}

export function AttendanceMarking({
  userName = "John Doe",
  userRole = "Employee",
  currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: AttendanceMarkingProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [busy, setBusy] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ---------------------------------------------------------------------------
  // Core Handlers
  // ---------------------------------------------------------------------------
  const handleStatusSelect = async (status: string) => {
    if (busy) return
    if (status === "wfh" || status === "leave") {
      setPendingStatus(status)
      setShowReasonDialog(true)
      return
    }

    if (status === "present") {
      await markPresent()
    }
  }

  // ---------------------------------------------------------------------------
  // Call Backend for Present
  // ---------------------------------------------------------------------------
  const markPresent = async () => {
    try {
      setBusy(true)

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation not supported"))
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      })

      const lat = position.coords.latitude
      const lon = position.coords.longitude

      const res = await fetch(`${API}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Present", lat, lon }),
      })

      if (!res.ok) {
        const errText = await res.text()
        alert(errText)
        return
      }

      alert("Attendance marked as Present ✅")
      setSelectedStatus("present")
      setIsSubmitted(true)
    } catch (err: any) {
      alert(err.message || "Unable to get location or mark attendance.")
    } finally {
      setBusy(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Call Backend for WFH / Leave
  // ---------------------------------------------------------------------------
  const handleReasonSubmit = async () => {
    if (!reason.trim() || !pendingStatus) return

    try {
      setBusy(true)

      const status = pendingStatus === "wfh" ? "WFM" : "Absent"
      const res = await fetch(`${API}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, reason }),
      })

      if (!res.ok) {
        const errText = await res.text()
        alert(errText)
        return
      }

      alert(`Attendance marked as ${status} ✅`)
      setSelectedStatus(pendingStatus)
      setIsSubmitted(true)
      setShowReasonDialog(false)
      setReason("")
      setPendingStatus(null)
    } catch (err: any) {
      alert(err.message || "Error submitting attendance.")
    } finally {
      setBusy(false)
    }
  }

  const handleReasonCancel = () => {
    setShowReasonDialog(false)
    setPendingStatus(null)
    setReason("")
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl">
            Welcome back, {userName}! Please mark your attendance for today.
          </CardTitle>

          <div className="flex items-center justify-center gap-8 text-sm">
            <span>{userName}</span>
            <span>{userRole}</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Choose Your Status</h2>
            <p className="text-muted-foreground">Select your attendance status for today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Present */}
            <Button
              variant={selectedStatus === "present" ? "default" : "outline"}
              className={`h-24 flex flex-col gap-2 text-base font-medium ${
                selectedStatus === "present"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-2 hover:border-green-600 hover:text-green-600"
              }`}
              onClick={() => handleStatusSelect("present")}
              disabled={isSubmitted || busy}
            >
              <CheckCircle className="h-6 w-6" />
              {busy && selectedStatus !== "present" ? "Marking..." : "Present"}
            </Button>

            {/* WFH */}
            <Button
              variant={selectedStatus === "wfh" ? "default" : "outline"}
              className={`h-24 flex flex-col gap-2 text-base font-medium ${
                selectedStatus === "wfh"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-2 hover:border-blue-600 hover:text-blue-600"
              }`}
              onClick={() => handleStatusSelect("wfh")}
              disabled={isSubmitted || busy}
            >
              <Home className="h-6 w-6" />
              Work From Home
            </Button>

            {/* Leave */}
            <Button
              variant={selectedStatus === "leave" ? "default" : "outline"}
              className={`h-24 flex flex-col gap-2 text-base font-medium ${
                selectedStatus === "leave"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "border-2 hover:border-orange-600 hover:text-orange-600"
              }`}
              onClick={() => handleStatusSelect("leave")}
              disabled={isSubmitted || busy}
            >
              <Calendar className="h-6 w-6" />
              Leave
            </Button>
          </div>

          {isSubmitted && (
            <div className="text-center text-sm text-muted-foreground">
              Your attendance was recorded at {getCurrentTime()} ✅
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{pendingStatus === "wfh" ? "Work From Home" : "Leave"} Reason</DialogTitle>
            <DialogDescription>
              Please provide a reason for your {pendingStatus === "wfh" ? "work from home" : "leave"} request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder={`Enter your reason for ${pendingStatus === "wfh" ? "working from home" : "taking leave"}...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleReasonCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleReasonSubmit}
              disabled={!reason.trim() || busy}
              className={
                pendingStatus === "wfh" ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"
              }
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
