import { Skeleton, SkeletonRegion } from "@/components/agere-ds";

export default function Loading() {
  return (
    <SkeletonRegion label="Loading tasks…" className="grid gap-2 p-6">
      {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-row w-full rounded-md" />)}
    </SkeletonRegion>
  );
}
