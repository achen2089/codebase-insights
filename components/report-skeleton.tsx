import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Code Structure */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardContent>
      </Card>

      {/* Complexity Analysis */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-64 w-full" /> {/* For BarChart */}
          <Skeleton className="h-32 w-full mt-4" /> {/* For Accordion */}
        </CardContent>
      </Card>

      {/* Documentation Coverage */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" /> {/* For Progress */}
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-8 w-full mb-4" /> {/* For Badges */}
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-8 w-full" /> {/* For Badges */}
        </CardContent>
      </Card>

      {/* Dependency Tracker */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Health Metrics */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSkeleton;