"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { useT } from "@/i18n/use-t";
import type { Student } from "@/types/student";
import { studentsService } from "@/services/students.service";

interface StudentInlineDetailsProps {
  studentId: string | number | null;
}

export function StudentInlineDetails({ studentId }: StudentInlineDetailsProps) {
  const t = useT();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (studentId) {
      setLoading(true);
      studentsService.get(studentId).then((data) => {
        if (mounted) {
          setStudent(data);
          setLoading(false);
        }
      }).catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    } else {
      setStudent(null);
    }
    return () => {
      mounted = false;
    };
  }, [studentId]);

  if (!studentId) return null;

  if (loading) {
    return (
      <div className="flex justify-center p-4 border rounded-md bg-muted/20 mt-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 shadow-sm relative overflow-hidden mt-4">
      <div className="flex items-center gap-4 border-b border-border/60 p-4 bg-muted/20">
        {student.image ? (
          <Image
            src={student.image}
            alt={student.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover border border-border/50 shadow-sm"
            unoptimized
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xl font-bold text-primary">{student.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-lg">{student.name}</h4>
          <p className="text-sm text-muted-foreground font-medium">{student.grade}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm p-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-muted-foreground">{t("schools.school")}</p>
          <p className="font-medium mt-1">{student.schoolName}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-muted-foreground">{t("students.bus")}</p>
          <p className="font-medium mt-1">{student.schoolBusLabel}</p>
        </div>
        {student.age !== null ? (
          <div className="col-span-2 sm:col-span-1">
            <p className="text-muted-foreground">{t("students.age")}</p>
            <p className="font-medium mt-1">{student.age}</p>
          </div>
        ) : null}
        {student.notes ? (
          <div className="col-span-2 mt-2 pt-4 border-t border-border/50">
            <p className="text-muted-foreground mb-1">{t("schools.notes")}</p>
            <p className="font-medium bg-muted/30 p-3 rounded-md text-sm">{student.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
