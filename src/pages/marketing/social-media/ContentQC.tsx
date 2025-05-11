
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react";

const mockData = [
  {
    id: 1,
    title: "Summer Collection Promotion",
    creator: "John Doe",
    submittedDate: "2025-05-05",
    platform: "Instagram",
    status: "Pending Review"
  },
  {
    id: 2,
    title: "Customer Testimonial Video",
    creator: "Jane Smith",
    submittedDate: "2025-05-07",
    platform: "Facebook",
    status: "Approved"
  },
  {
    id: 3,
    title: "Product Launch Announcement",
    creator: "Mike Johnson",
    submittedDate: "2025-05-08",
    platform: "LinkedIn",
    status: "Needs Revision"
  },
  {
    id: 4,
    title: "Behind the Scenes",
    creator: "Sarah Williams",
    submittedDate: "2025-05-10",
    platform: "TikTok",
    status: "Pending Review"
  },
  {
    id: 5,
    title: "Weekly Tips & Tricks",
    creator: "Alex Brown",
    submittedDate: "2025-05-11",
    platform: "Twitter",
    status: "Needs Revision"
  },
];

const ContentQC = () => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<typeof mockData[0] | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | "comment">("comment");

  const handleReview = (content: typeof mockData[0], action: "approve" | "reject" | "comment") => {
    setSelectedContent(content);
    setDialogAction(action);
    setReviewNotes("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    // In a real application, we would update the content status
    console.log("Review submitted:", {
      contentId: selectedContent?.id,
      action: dialogAction,
      notes: reviewNotes
    });
    setIsReviewDialogOpen(false);
  };

  const getDialogTitle = () => {
    switch (dialogAction) {
      case "approve":
        return "Approve Content";
      case "reject":
        return "Request Revision";
      case "comment":
        return "Add Comment";
      default:
        return "Review Content";
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Content Quality Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Content Title</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell>{content.creator}</TableCell>
                  <TableCell>{content.platform}</TableCell>
                  <TableCell>{content.submittedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${content.status === "Approved" ? "border-green-500 text-green-600 bg-green-50" : ""}
                        ${content.status === "Pending Review" ? "border-amber-500 text-amber-600 bg-amber-50" : ""}
                        ${content.status === "Needs Revision" ? "border-red-500 text-red-600 bg-red-50" : ""}
                      `}
                    >
                      {content.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" 
                        onClick={() => handleReview(content, "comment")}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-500 hover:text-green-600"
                        onClick={() => handleReview(content, "approve")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleReview(content, "reject")}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedContent && (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium">{getDialogTitle()}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Content: {selectedContent.title}</p>
                <p className="text-sm text-muted-foreground">Creator: {selectedContent.creator}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base">
                  {dialogAction === "approve" ? "Approval notes (optional)" : 
                   dialogAction === "reject" ? "Revision notes (required)" : 
                   "Comment"}
                </Label>
                <Textarea
                  id="notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={dialogAction === "approve" ? "Add any notes for the approved content..." : 
                              dialogAction === "reject" ? "Explain what needs to be revised..." :
                              "Add your comment..."}
                  className="min-h-[100px]"
                  required={dialogAction === "reject"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                className={
                  dialogAction === "approve" ? "bg-green-500 hover:bg-green-600 text-white" :
                  dialogAction === "reject" ? "bg-red-500 hover:bg-red-600 text-white" :
                  ""
                }
                disabled={dialogAction === "reject" && !reviewNotes.trim()}
              >
                {dialogAction === "approve" ? "Approve" : 
                 dialogAction === "reject" ? "Request Revision" : 
                 "Submit Comment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ContentQC;
