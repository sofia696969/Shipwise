import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => (
  <div className="space-y-6 p-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">Platform and organization configuration</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Organization Name</Label><Input defaultValue="Acme Logistics" /></div>
          <div>
            <Label>Industry Type</Label>
            <Select defaultValue="logistics"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["logistics", "manufacturing", "retail", "food"].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">ML Features</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Delay Prediction</p><p className="text-xs text-muted-foreground">Predict shipment delays using ML</p></div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Risk Scoring</p><p className="text-xs text-muted-foreground">Customs/compliance risk assessment</p></div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Cost Prediction</p><p className="text-xs text-muted-foreground">Estimate shipping costs with ML</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Roles & Permissions</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="font-medium text-foreground">Admin</span>
            <span className="text-muted-foreground">Full access</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="font-medium text-foreground">Supervisor</span>
            <span className="text-muted-foreground">Read + manage shipments</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="font-medium text-foreground">Staff</span>
            <span className="text-muted-foreground">Read only</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">System</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Retrain Models</p><p className="text-xs text-muted-foreground">Trigger ML model retraining</p></div>
            <Button variant="outline" size="sm">Retrain</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-foreground">Global Carrier Dataset</p><p className="text-xs text-muted-foreground">Manage carrier data</p></div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SettingsPage;
