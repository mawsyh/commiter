"use client"

import { useEffect, useState } from "react"
import { Calendar, Info, Loader2 } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["", "Mon", "", "Wed", "", "Fri", ""]

export default function Commiter() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDates, setSelectedDates] = useState<Record<string, number> | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [repository, setRepository] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => setShowAlert(false), 5000)
    }
  }, [showAlert])

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
    const date = new Date(Date.UTC(year, 0));
    date.setUTCDate(dayOfYear);
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
      setIsLoading(true);
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
        toast({
          title: "Commits successfully pushed to GitHub!",
          description: "Click on the profile button to check the result of the commit process",
          action: <ToastAction altText="Check your profile">
            <a target="_blank" href={'https://github.com/' + username}>Profile</a>
          </ToastAction>,
        })
      } else {
        const { error } = await response.json();
        toast({
          title: "Something went wrong!",
          description: error,
        })
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please check the console for details.");
    } finally {
      setIsLoading(false);
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
            <video
              loop
              autoPlay
              muted
              src="/howto.mp4"
              className="w-full h-full object-cover"
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
              "overflow-scroll transition-all duration-300 ease-in-out max-h-[500px] opacity-100"
            >
              <div className="bg-gray-950/30 rounded-lg p-4 border border-gray-800 min-w-[760px]">
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
                      {(() => {
                        const cells = [];
                        const firstDayOfYear = new Date(Date.UTC(selectedYear, 0, 1));
                        const firstDayOffset = firstDayOfYear.getUTCDay(); // Use UTC day

                        // Add empty cells for days before January 1st
                        for (let i = 0; i < firstDayOffset; i++) {
                          cells.push(
                            <div
                              key={`empty-${i}`}
                              className="w-[10px] h-[10px] rounded-sm bg-transparent"
                              style={{
                                gridColumn: 1,
                                gridRow: i + 1,
                              }}
                            />
                          );
                        }

                        // Add cells for actual days in the year
                        for (let dayOfYear = 1; dayOfYear <= getDaysInYear(selectedYear); dayOfYear++) {
                          const date = formatDate(selectedYear, dayOfYear);
                          const currentDate = new Date(date + 'T00:00:00.000Z'); // Force UTC
                          const dayOfWeek = currentDate.getUTCDay();
                          const weekNumber = Math.floor((dayOfYear + firstDayOffset - 1) / 7);
                          const isCurrentYear = selectedYear === new Date().getUTCFullYear();
                          const isInFuture = isCurrentYear && dayOfYear > getCurrentDayOfYear();
                          const clickCount = selectedDates && date in selectedDates ? selectedDates[date] : 0;

                          cells.push(
                            <Tooltip key={dayOfYear}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "w-[10px] h-[10px] rounded-sm cursor-pointer transition-colors",
                                    getDateColor(clickCount),
                                    !isInFuture && "hover:ring-2 hover:ring-gray-500"
                                  )}
                                  style={{
                                    gridColumn: weekNumber + 1,
                                    gridRow: dayOfWeek + 1,
                                  }}
                                  onMouseDown={() => !isInFuture && handleMouseDown(dayOfYear)}
                                  onMouseEnter={() => !isInFuture && handleMouseEnter(dayOfYear)}
                                  onMouseUp={handleMouseUp}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{date} (Commits: {clickCount})</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return cells;
                      })()}
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

          <section className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" className="bg-gray-900 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="token">Access Token</Label>
                  <a href="https://github.com/settings/tokens?type=beta" target="_blank" className="text-[11px] underline">(make one)</a>
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
                        <li>Generate a new fine-grained token</li>
                        <li>Select a new empty repository</li>
                        <li>Grant content access</li>
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
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin-slow mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate Commits
                  </>
                )}
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </TooltipProvider>
  )
}