'use client';

import { useEffect, useState } from "react";
import { getUsers } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const roleStyles = {
  admin: "bg-primary/10 text-primary border-primary/30",
  supervisor: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  staff: "bg-secondary/30 text-secondary-foreground border-border",
};

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage staff users and access control</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add User</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Full Name</Label><Input placeholder="John Doe" /></div>
              <div><Label>Email</Label><Input type="email" placeholder="john@shipwise.io" /></div>
              <div>
                <Label>Role</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {["admin", "supervisor", "staff"].map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-2">Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className={`capitalize text-xs ${roleStyles[u.role as keyof typeof roleStyles]}`}>{u.role}</Badge></TableCell>
                  <TableCell><StatusBadge status={u.status as any} /></TableCell>
                  <TableCell className="text-sm">{u.last_active}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
