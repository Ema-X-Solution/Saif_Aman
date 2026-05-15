"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildReviewColumns } from "@/features/reviews/lib/review-columns";
import { reviewsService } from "@/services/reviews.service";
import type { Review } from "@/types/review";

export function ReviewsView() {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildReviewColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await reviewsService.list();
        if (!c) setData(rows);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews & ratings"
        description="Parent sentiment across schools with lightweight moderation tools."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search reviews..."
        globalSearchAccessor={(row) =>
          `${row.schoolName} ${row.parentName} ${row.comment}`
        }
      />
    </div>
  );
}
