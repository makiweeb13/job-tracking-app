"use-client"

import { Plus } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";


export default function CreateJob({ columnId, boardId }: { columnId: string; boardId: string }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        position: "",
        company: "",
        description: "",
        jobLink: "",
        location: "",
        applicationDate: "",
        salary: "",
        tags: "",
        notes: ""
    });
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createJobApplication({
                ...formData,
                columnId,
                boardId,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter((v): v is string => !!v) // Convert comma-separated string to array
            });

            // Assume success if no exception thrown
            setFormData({
                position: "",
                company: "",
                description: "",
                jobLink: "",
                location: "",
                applicationDate: "",
                salary: "",
                tags: "",
                notes: ""
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Error creating job application:", error);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                </Button>
            </DialogTrigger>
            {/* Increased width to 600px to accommodate two columns */}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Job Application</DialogTitle>
                    <DialogDescription>
                        Fill out the details of your job application below.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
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
                            <Label htmlFor="job-link">Job Link</Label>
                            <Input id="job-link" placeholder="https://..." value={formData.jobLink} onChange={(e) => setFormData({...formData, jobLink: e.target.value})} />
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
                            <Input id="salary" type="text" placeholder="e.g. $120k - $150k" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
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
                        <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="px-8">
                            Create Job
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}