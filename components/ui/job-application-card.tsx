import { Column, JobApplication } from "@/lib/models/models.type";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapPin, Calendar, FileText, Tag, Edit, Edit2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Assuming shadcn badge
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

interface jobApplicationCardProps {
    job: JobApplication;
    columns?: Column[];
}

export default function JobApplicationCard({ job, columns }: jobApplicationCardProps) {
    return (
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
                                <DropdownMenuItem><Edit2Icon className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                {columns && columns.length > 1 && (
                                    <>
                                        {columns.filter(col => col._id !== job.columnId).map((col) => (
                                            <DropdownMenuItem key={col._id}>Move to {col.name}</DropdownMenuItem>
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
    );
}
