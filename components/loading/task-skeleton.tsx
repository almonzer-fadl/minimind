import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-4 w-4 rounded mt-1" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </Card>
  )
}

export function TaskListSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <TaskSkeleton key={j} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
