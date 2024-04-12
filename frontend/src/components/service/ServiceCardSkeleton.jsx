import { Skeleton } from "../ui/skeleton"

export default function ServiceCardSkeleton() {
   return (
      <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl relative">
         <Skeleton className="w-80 h-80 rounded-t-xl" />
         <div className="flex flex-col gap-y-3 px-4 py-3 w-72">
            <Skeleton className="w-64 h-6" />
            <Skeleton className="w-60 h-6" />
            <br />
            <Skeleton className="w-72 h-6" />
            <Skeleton className="w-64 h-6" />
            <Skeleton className="w-56 h-6" />
            <Skeleton className="w-60 h-6" />
         </div>
      </div>
   )
}
