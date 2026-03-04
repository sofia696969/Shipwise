'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export const GoodsDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Goods</Button></DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Add New Goods</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div><Label>Name</Label><Input placeholder="Product name" /></div>
          <div>
            <Label>Category</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="chemicals">Chemicals</SelectItem>
                <SelectItem value="food">Food & Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Weight (kg)</Label><Input type="number" placeholder="0.00" /></div>
            <div><Label>Volume (m³)</Label><Input type="number" placeholder="0.00" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Fragile?</Label><Input type="checkbox" /></div>
            <div><Label>Hazardous?</Label><Input type="checkbox" /></div>
          </div>
          <Button className="mt-2">Add Goods</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
