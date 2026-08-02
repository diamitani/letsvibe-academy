import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden h-full">
          <Skeleton className="w-full aspect-[16/9]" />
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
          </CardContent>
          <CardFooter className="px-6 py-4 border-t">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col">
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
