import { Badge } from "@/components/ui/badge";

type Status = "on-time" | "delayed" | "at-risk" | "active" | "inactive" | "open" | "investigating" | "resolved";

const statusStyles: Record<Status, string> = {
  "on-time": "bg-primary/15 text-primary border-primary/30",
  "delayed": "bg-destructive/15 text-destructive border-destructive/30",
  "at-risk": "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "active": "bg-primary/15 text-primary border-primary/30",
  "inactive": "bg-muted text-muted-foreground border-border",
  "open": "bg-destructive/15 text-destructive border-destructive/30",
  "investigating": "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "resolved": "bg-primary/15 text-primary border-primary/30",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <Badge variant="outline" className={`text-xs font-medium capitalize ${statusStyles[status] || ""}`}>
    {status.replace("-", " ")}
  </Badge>
);

export default StatusBadge;
