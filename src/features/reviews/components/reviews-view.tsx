"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildReviewColumns } from "@/features/reviews/lib/review-columns";
import { reviewsService } from "@/services/reviews.service";
import type { Review } from "@/types/review";
import { useT } from "@/i18n/use-t";

export function ReviewsView() {
  const t = useT();
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
        title={t("reviews.title")}
        description={t("reviews.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("reviews.searchReviews")}
        globalSearchAccessor={(row) =>
          `${row.schoolName} ${row.parentName} ${row.comment}`
        }
      />
    </div>
  );
}
