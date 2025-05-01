
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle, Clock, CheckCircle, XCircle, Presentation, History, Download, Calendar, Edit, Trash2 } from "lucide-react";
import { MeetingStatus, MeetingSummaryCard } from "@/components/meetings/MeetingSummaryCard";
import { MeetingUpdateItem } from "@/components/meetings/MeetingUpdateItem";
import { MeetingStatusBadge } from "@/components/meetings/MeetingStatusBadge";
import { MeetingActionButton } from "@/components/meetings/MeetingActionButton";

interface MeetingPoint {
  id: number;
  date: string;
  discussionPoint: string;
  requestBy: string;
  status: MeetingStatus;
  updates: number;
}

const initialMeetingPoints: MeetingPoint[] = [
  {
    id: 1,
    date: "May 1, 2025",
    discussionPoint: "Review Q2 marketing strategy",
    requestBy: "John Doe",
    status: "not-started",
    updates: 1
  },
  {
    id: 2,
    date: "May 1, 2025",
    discussionPoint: "Website redesign progress",
    requestBy: "Jane Smith",
    status: "on-going",
    updates: 1
  }
];

const CatatanMeetings = () => {
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>(initialMeetingPoints);
  const [newPoint, setNewPoint] = useState<string>("");
  const currentDate = "1 May 2025";
  
  const handleAddPoint = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPoint.trim() !== "") {
      const newMeetingPoint: MeetingPoint = {
        id: meetingPoints.length + 1,
        date: "May 1, 2025",
        discussionPoint: newPoint,
        requestBy: "",
        status: "not-started",
        updates: 0
      };
      
      setMeetingPoints([...meetingPoints, newMeetingPoint]);
      setNewPoint("");
    }
  };
  
  // Count meeting points by status
  const notStartedCount = meetingPoints.filter(point => point.status === "not-started").length;
  const onGoingCount = meetingPoints.filter(point => point.status === "on-going").length;
  const completedCount = meetingPoints.filter(point => point.status === "completed").length;
  const rejectedCount = meetingPoints.filter(point => point.status === "rejected").length;
  const presentedCount = meetingPoints.filter(point => point.status === "presented").length;
  const updatesCount = meetingPoints.reduce((sum, point) => sum + point.updates, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h1 className="text-2xl font-semibold">{currentDate}</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Download Minutes
          </Button>
        </div>
        
        <div className="flex flex-1">
          {/* Main content area - 75% */}
          <div className="w-3/4 p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meeting Points</h2>
                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="on-going">On Going</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="presented">Presented</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Request By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Request By</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-[150px] bg-[#f5f5fa]">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="bg-white border-b">
                      <TableHead className="w-[150px] py-4">DATE</TableHead>
                      <TableHead className="py-4">DISCUSSION POINT</TableHead>
                      <TableHead className="py-4">REQUEST BY</TableHead>
                      <TableHead className="py-4">STATUS</TableHead>
                      <TableHead className="py-4">UPDATES</TableHead>
                      <TableHead className="py-4">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetingPoints.map((point, index) => (
                      <TableRow key={point.id} className={index % 2 === 0 ? "" : "bg-[#f9fafb]"}>
                        <TableCell className="py-4">{point.date}</TableCell>
                        <TableCell className="py-4">{point.discussionPoint}</TableCell>
                        <TableCell className="py-4">
                          <Select defaultValue={point.requestBy ? point.requestBy.toLowerCase().replace(" ", "-") : ""}>
                            <SelectTrigger className="w-[120px] bg-[#f5f5fa]">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john-doe">John Doe</SelectItem>
                              <SelectItem value="jane-smith">Jane Smith</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-4">
                          <MeetingStatusBadge status={point.status} />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center text-blue-500">
                            <History size={16} />
                            <span className="ml-2">{point.updates}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex space-x-2">
                            <MeetingActionButton icon={Edit} label="Edit" onClick={() => {}} />
                            <MeetingActionButton icon={Trash2} label="Delete" variant="destructive" onClick={() => {}} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="py-4">{currentDate.replace("1 ", "1, ")}</TableCell>
                      <TableCell colSpan={5} className="py-4">
                        <input
                          type="text"
                          placeholder="Type a new discussion point and press Enter..."
                          className="w-full py-2 focus:outline-none text-gray-500 italic"
                          value={newPoint}
                          onChange={(e) => setNewPoint(e.target.value)}
                          onKeyDown={handleAddPoint}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          {/* Sidebar - 25% */}
          <div className="w-1/4 bg-white p-6 border-l">
            <h2 className="text-xl font-semibold mb-6">Meeting Summary</h2>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Today's Points</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MeetingSummaryCard 
                    status="not-started" 
                    count={notStartedCount} 
                    icon={AlertTriangle} 
                    label="Not Started" 
                  />
                  <MeetingSummaryCard 
                    status="on-going" 
                    count={onGoingCount} 
                    icon={Clock} 
                    label="On Going" 
                  />
                  <MeetingSummaryCard 
                    status="completed" 
                    count={completedCount} 
                    icon={CheckCircle} 
                    label="Completed" 
                  />
                  <MeetingSummaryCard 
                    status="rejected" 
                    count={rejectedCount} 
                    icon={XCircle} 
                    label="Rejected" 
                  />
                  <MeetingSummaryCard 
                    status="presented" 
                    count={presentedCount} 
                    icon={Presentation} 
                    label="Presented" 
                  />
                  <MeetingSummaryCard 
                    status="updates" 
                    count={updatesCount} 
                    icon={History} 
                    label="Updates" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <h3 className="text-lg font-medium mb-4">Recent Updates</h3>
            <div className="space-y-4">
              <MeetingUpdateItem 
                title="Review Q2 marketing strategy"
                status="not-started"
                person="John Doe"
                date="1 May"
              />
              <MeetingUpdateItem 
                title="Website redesign progress"
                status="on-going"
                person="Jane Smith"
                date="1 May"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-8 right-8">
        <Button variant="default" size="icon" className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700">
          <span className="text-2xl">+</span>
        </Button>
      </div>
      
      <Toaster />
    </div>
  );
};

export default CatatanMeetings;
