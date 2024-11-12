"use client"

import { useState } from "react"
import { Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Footer } from "./_sections/footer"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["", "Mon", "", "Wed", "", "Fri", ""]

export default function Commiter() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDates, setSelectedDates] = useState<Record<string, number> | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [repository, setRepository] = useState("");

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const getDaysInYear = (year: number) => {
    return isLeapYear(year) ? 366 : 365
  }

  const getCurrentDayOfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000)
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  const formatDate = (year: number, dayOfYear: number) => {
    const date = new Date(year, 0)
    date.setDate(dayOfYear)
    return date.toISOString().split('T')[0];
  }

  const handleDateClick = (dayOfYear: number) => {
    const fullDate = formatDate(selectedYear, dayOfYear)
    setSelectedDates(prev => {
      const newDates = { ...prev }
      if (fullDate in newDates) {
        if (newDates[fullDate] < 9) {
          newDates[fullDate]++
        } else {
          delete newDates[fullDate]
        }
      } else {
        newDates[fullDate] = 1
      }
      return newDates
    })
  }

  const handleMouseDown = (dayOfYear: number) => {
    setIsDragging(true)
    handleDateClick(dayOfYear)
  }

  const handleMouseEnter = (dayOfYear: number) => {
    if (isDragging) {
      handleDateClick(dayOfYear)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear - 1998 }, (_, i) => currentYear - i)
  }

  const handleSubmit = async () => {
    try {
      const reqBody = {
        username,
        accessToken,
        repository,
        days: selectedDates,
      };

      const response = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (response.ok) {
        alert("Commits successfully pushed to GitHub!");
      } else {
        const { error } = await response.json();
        alert("Error: " + error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please check the console for details.");
    }
  }

  const getDateColor = (count: number) => {
    switch (count) {
      case 1: return "bg-orange-200 bg-opacity-40"
      case 2: return "bg-orange-200 bg-opacity-60"
      case 3: return "bg-orange-300 bg-opacity-60"
      case 4: return "bg-orange-400"
      case 5: return "bg-orange-500"
      case 6: return "bg-orange-600"
      case 7: return "bg-orange-700"
      case 8: return "bg-orange-800"
      case 9: return "bg-orange-900"
      default: return "bg-gray-800"
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black text-white p-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Commiter</h1>
          <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=200&width=500"
              alt="How Commiter works"
              className="w-full h-40 object-cover"
            />
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className=
              "transition-all duration-300 ease-in-out overflow-hidden max-h-[500px] opacity-100"
            >
              <div className="bg-gray-950/30 rounded-lg p-4 border border-gray-800">
                <div className="flex">
                  <div className="grid grid-rows-7 gap-1 text-xs text-gray-400 pr-2 mt-6">
                    {days.map((day, index) => (
                      <div key={index} className="h-[10px] leading-[10px]">{day}</div>
                    ))}
                  </div>
                  <div>
                    <div className="grid grid-cols-[repeat(51,minmax(0,1fr))] gap-1 mb-2">
                      {months.map((month, index) => (
                        <div key={month} className="text-center text-xs text-gray-400" style={{
                          gridColumn: `${Math.floor(index * 4.25) + 1} / span 4`
                        }}>
                          {month}
                        </div>
                      ))}
                    </div>
                    <div
                      className="grid grid-cols-[repeat(51,minmax(0,1fr))] grid-rows-7 gap-1"
                      onMouseLeave={handleMouseUp}
                    >
                      {[...Array(getDaysInYear(selectedYear))].map((_, index) => {
                        const dayOfYear = index + 1
                        const date = new Date(selectedYear, 0)
                        date.setDate(dayOfYear)
                        const dayOfWeek = date.getDay()
                        const weekNumber = Math.floor(index / 7)
                        const isCurrentYear = selectedYear === new Date().getFullYear()
                        const isInFuture = isCurrentYear && dayOfYear > getCurrentDayOfYear()
                        const fullDate = formatDate(selectedYear, dayOfYear)
                        const clickCount = selectedDates && [fullDate] ? selectedDates[fullDate] : 0

                        return (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "w-[10px] h-[10px] rounded-sm cursor-pointer transition-colors",
                                  getDateColor(clickCount),
                                  !isInFuture && "hover:ring-2 hover:ring-gray-500"
                                )}
                                style={{
                                  gridColumn: weekNumber + 1,
                                  gridRow: dayOfWeek === 0 ? 7 : dayOfWeek,
                                }}
                                onMouseDown={() => !isInFuture && handleMouseDown(dayOfYear)}
                                onMouseEnter={() => !isInFuture && handleMouseEnter(dayOfYear)}
                                onMouseUp={handleMouseUp}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{fullDate} (Clicks: {clickCount})</p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-400">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-[10px] h-[10px] rounded-sm",
                          i === 0 && "bg-gray-800",
                          i === 1 && "bg-orange-200 bg-opacity-40",
                          i === 2 && "bg-orange-400",
                          i === 3 && "bg-orange-700",
                          i === 4 && "bg-orange-900"
                        )}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="token">Access Token</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To get your GitHub access token:</p>
                      <ol className="list-decimal list-inside">
                        <li>Go to GitHub Settings</li>
                        <li>Click on Developer settings</li>
                        <li>Select Personal access tokens</li>
                        <li>Generate a new token</li>
                      </ol>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input value={accessToken} onChange={(e) => setAccessToken(e.target.value)} type="password" placeholder="GitHub access token" className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repository">Repository</Label>
                <Input value={repository} onChange={(e) => setRepository(e.target.value)} placeholder="repository" className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600">
                <Calendar className="mr-2 h-4 w-4" /> Generate Commits
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </TooltipProvider>
  )
}