import { Column, JobApplication } from "@/lib/models/models.type";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapPin, Calendar, FileText, Tag, Edit, Edit2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { updateJobApplication } from "@/lib/actions/job-applications";
import { useState } from "react";

interface jobApplicationCardProps {
    job: JobApplication;
    columns?: Column[];
}

export default function JobApplicationCard({ job, columns }: jobApplicationCardProps) {
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        position: "",
        company: "",
        description: "",
        jobUrl: "",
        location: "",
        applicationDate: "",
        salary: "",
        tags: "",
        notes: ""
    });

    async function handleMove(newColumnId: string) {
        try {
            await updateJobApplication(job._id, { columnId: newColumnId });
        } catch (error) {
            console.error("Failed to move job application:", error);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateJobApplication(job._id, {
                position: formData.position,
                company: formData.company,
                description: formData.description,
                jobUrl: formData.jobUrl,
                location: formData.location,
                applicationDate: formData.applicationDate,
                salary: formData.salary,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter((v): v is string => !!v),
                notes: formData.notes,
                columnId: job.columnId,
                boardId: job.boardId
            });

            setFormData({
                position: "",
                company: "",
                description: "",
                jobUrl: "",
                location: "",
                applicationDate: "",
                salary: "",
                tags: "",
                notes: ""
            });
            setIsUpdateOpen(false);
        } catch (error) {
            console.error("Error updating job application:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    function openUpdateDialog() {
        setFormData({
            position: job.position || "",
            company: job.company || "",
            description: job.description || "",
            jobUrl: job.jobUrl || "",
            location: job.location || "",
            applicationDate: job.applicationDate ? new Date(job.applicationDate).toISOString().split('T')[0] : "",
            salary: job.salary?.toString() || "",
            tags: job.tags?.join(", ") || "",
            notes: job.notes || ""
        });
        setIsUpdateOpen(true);
    }

    return (
        <>
            <Card className="group mb-3 cursor-pointer border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {job.position}
                            </CardTitle>
                            <p className="text-sm font-medium text-slate-600">{job.company}</p>
                        </div>
                        {job.salary && (
                            <div className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                                {"₱" + job.salary}
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 pt-0 space-y-3">
                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
                        {job.location && (
                            <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {job.location}
                            </div>
                        )}
                        {job.applicationDate && (
                            <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(job.applicationDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {/* Description - Clamped to 2 lines to save space */}
                    {job.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
                            "{job.description}"
                        </p>
                    )}

                    {/* Tags & Bottom Row */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap gap-1">
                            {job.tags?.slice(0, 3).map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-600 border-none"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {job.tags && job.tags.length > 3 && (
                                <span className="text-[10px] text-slate-400">+{job.tags.length - 3}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {job?.jobUrl && (
                                <a href={job?.jobUrl} target="_blank" rel="noopener noreferrer">
                                    <Tag className="h-3.5 w-3.5 text-slate-300" />
                                </a>
                            )}

                            {job.notes && (
                                <span title={job.notes}>
                                    <FileText className="h-3.5 w-3.5 text-slate-300" />
                                </span>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-700">
                                        <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={openUpdateDialog}><Edit2Icon className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                    {columns && columns.length > 1 && (
                                        <>
                                            {columns.filter(col => col._id !== job.columnId).map((col) => (
                                                <DropdownMenuItem key={col._id} onClick={() => handleMove(col._id)}>
                                                    Move to {col.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </>
                                    )}
                                    {columns?.at(2) && (
                                        <DropdownMenuItem><Trash2Icon className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                <DialogContent className="sm:max-w-150">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Update Job Application</DialogTitle>
                        <DialogDescription>
                            Modify the details of your job application below.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-6 pt-2" onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Row 1: Position & Company */}
                            <div className="space-y-2">
                                <Label htmlFor="job-position">Position *</Label>
                                <Input id="job-position" placeholder="e.g. Software Engineer" required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Company Name *</Label>
                                <Input id="company-name" placeholder="e.g. Acme Corp" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                            </div>

                            {/* Row 2: Description (Full Width) */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="job-description">Job Description</Label>
                                <Textarea id="job-description" rows={3} placeholder="Brief description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                            </div>

                            {/* Row 3: Link & Location */}
                            <div className="space-y-2">
                                <Label htmlFor="job-url">Job URL</Label>
                                <Input id="job-url" placeholder="https://..." value={formData.jobUrl} onChange={(e) => setFormData({...formData, jobUrl: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" placeholder="Remote / NYC" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                            </div>

                            {/* Row 4: Date & Salary */}
                            <div className="space-y-2">
                                <Label htmlFor="application-date">Application Date</Label>
                                <Input id="application-date" type="date" value={formData.applicationDate} onChange={(e) => setFormData({...formData, applicationDate: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary Range</Label>
                                <Input id="salary" type="text" placeholder="e.g. 120k - 150k" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                            </div>

                            {/* Row 5: Tags (Full Width) */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                <Input id="tags" placeholder="Applied, Interviewing, High Priority" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                            </div>

                            {/* Row 6: Notes (Full Width) */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" rows={2} placeholder="Additional details..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" type="button" onClick={() => setIsUpdateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="px-8" disabled={isSubmitting}>
                                Update Job
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
