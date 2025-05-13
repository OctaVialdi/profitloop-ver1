
import React from "react";
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from "@/hooks/content-plan";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentPlanTableRow from "./ContentPlanTableRow";

interface ContentPlanTableProps {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  contentPlanners: TeamMember[];
  creativeTeamMembers: TeamMember[];
  loading: boolean;
  selectedItems: string[];
  handleSelectItem: (id: string, checked: boolean) => void;
  handleDateChange: (id: string, date: Date | undefined) => void;
  handleFieldChange: (id: string, field: string, value: any) => void;
  getFilteredSubServices: (serviceId: string) => SubService[];
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function ContentPlanTable({
  contentPlans,
  contentTypes,
  services,
  subServices,
  contentPillars,
  contentPlanners,
  creativeTeamMembers,
  loading,
  selectedItems,
  handleSelectItem,
  handleDateChange,
  handleFieldChange,
  getFilteredSubServices,
  resetRevisionCounter,
  formatDisplayDate,
  extractLink,
  openBriefDialog,
  openTitleDialog
}: ContentPlanTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="h-[600px] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-width-3200 table-auto">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="text-center whitespace-nowrap sticky left-0 bg-background z-20 w-[60px] border-r">Action</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Tanggal Posting</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Tipe Content</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[120px] border-r">PIC</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Layanan</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Sub Layanan</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Judul Content</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Content Pillar</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Brief</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Status</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Revision</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Approved</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Selesai</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Tanggal Upload</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Tipe Content</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[180px] border-r">Judul Content</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">PIC Produksi</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Link Google Drive</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">Status Produksi</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[120px] border-r">Revisi Counter</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Selesai Produksi</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[100px] border-r">Approved</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Tanggal Approved</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[150px] border-r">Download Link File</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[220px] border-r">Link Post</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[80px] border-r">Done</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px] border-r">Actual Post</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[140px] border-r">On Time Status</TableHead>
                  <TableHead className="text-center whitespace-nowrap w-[160px]">Status Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={29} className="text-center py-4">Loading content plans...</TableCell>
                  </TableRow>
                ) : contentPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={29} className="text-center py-4">No content plans available. Add a new row to get started.</TableCell>
                  </TableRow>
                ) : (
                  contentPlans.map((item: ContentPlanItem) => (
                    <ContentPlanTableRow
                      key={item.id}
                      item={item}
                      contentTypes={contentTypes}
                      services={services}
                      contentPillars={contentPillars}
                      contentPlanners={contentPlanners}
                      creativeTeamMembers={creativeTeamMembers}
                      selectedItems={selectedItems}
                      getFilteredSubServices={getFilteredSubServices}
                      handleSelectItem={handleSelectItem}
                      handleDateChange={handleDateChange}
                      handleFieldChange={handleFieldChange}
                      resetRevisionCounter={resetRevisionCounter}
                      formatDisplayDate={formatDisplayDate}
                      extractLink={extractLink}
                      openBriefDialog={openBriefDialog}
                      openTitleDialog={openTitleDialog}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
