
import React from "react";
import { Button } from "@/components/ui/button";
import { FilePlus, Filter, FileDown, RotateCw, Upload, Eye, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Ticket } from "./types";
import { 
  getPriorityBadgeClass, 
  getStatusBadgeClass,
  getResponseTimeClass,
  getResolutionInfo
} from "./ticketUtils";

interface TicketTableProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  onUploadForTicket: (ticketId: string) => void;
  onCreateTicket: () => void;
  onUpload: () => void;
  onMarkAsResolved: (ticket: Ticket) => void;
  onApproveTicket: (ticket: Ticket) => void;
  onRejectTicket: (ticket: Ticket) => void;
}

export default function TicketTable({
  tickets,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onUploadForTicket,
  onCreateTicket,
  onUpload,
  onMarkAsResolved,
  onApproveTicket,
  onRejectTicket
}: TicketTableProps) {
  return (
    <div>
      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 flex items-center gap-1"
            onClick={onCreateTicket}
          >
            <FilePlus size={16} /> New Ticket
          </Button>
          <Button
            variant="outline" 
            className="flex items-center gap-1"
            onClick={onUpload}
          >
            <Upload size={16} /> Upload
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <RotateCw size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Input
              placeholder="Search tickets..."
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter size={16} /> Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <FileDown size={16} /> Export
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{ticket.category.icon}</span> {ticket.category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadgeClass(ticket.priority)} variant="outline">
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(ticket.status)} variant="outline">
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell>
                    <span className={getResponseTimeClass(ticket.response.type).className}>
                      {getResponseTimeClass(ticket.response.type).icon} {ticket.response.time}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getResolutionInfo(ticket.resolution).className}>
                      {getResolutionInfo(ticket.resolution).icon} {getResolutionInfo(ticket.resolution).time}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="View Details"
                        onClick={() => onViewTicket(ticket)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit"
                        onClick={() => onEditTicket(ticket)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => onDeleteTicket(ticket)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-purple-500 hover:text-purple-700"
                        title="Upload Files"
                        onClick={() => onUploadForTicket(ticket.id)}
                      >
                        <Upload size={16} />
                      </Button>
                      {ticket.status !== "Resolved" && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-500 hover:text-green-700" 
                          title="Mark as Resolved"
                          onClick={() => onMarkAsResolved(ticket)}
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                      )}
                      {ticket.status !== "In Progress" && ticket.status !== "Resolved" && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-amber-500 hover:text-amber-700" 
                          title="Approve"
                          onClick={() => onApproveTicket(ticket)}
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                      )}
                      {ticket.status !== "Rejected" && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700" 
                          title="Reject"
                          onClick={() => onRejectTicket(ticket)}
                        >
                          <AlertCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
