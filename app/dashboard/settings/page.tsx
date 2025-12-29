"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Users, Shield, Moon, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [hotelSettings, setHotelSettings] = useState({
    name: "Grand Palace Hotel",
    location: "Lagos, Nigeria",
    currency: "₦",
    timezone: "Africa/Lagos",
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    shortStay: true,
    autoLogout: true,
    emailNotifications: true,
    smsAlerts: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your hotel and account preferences</p>
      </div>

      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="hotel" className="gap-2">
            <Building2 className="h-4 w-4" />
            Hotel Profile
          </TabsTrigger>
          <TabsTrigger value="staff" className="gap-2">
            <Users className="h-4 w-4" />
            Staff & Roles
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Moon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Hotel Profile */}
        <TabsContent value="hotel" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Hotel Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  value={hotelSettings.name}
                  onChange={(e) => setHotelSettings({ ...hotelSettings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={hotelSettings.location}
                  onChange={(e) => setHotelSettings({ ...hotelSettings, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={hotelSettings.currency}
                  onValueChange={(value) => setHotelSettings({ ...hotelSettings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₦">Nigerian Naira (₦)</SelectItem>
                    <SelectItem value="$">US Dollar ($)</SelectItem>
                    <SelectItem value="€">Euro (€)</SelectItem>
                    <SelectItem value="£">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={hotelSettings.timezone}
                  onValueChange={(value) => setHotelSettings({ ...hotelSettings, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="hero" onClick={handleSave}>Save Changes</Button>
          </div>
        </TabsContent>

        {/* Staff & Roles */}
        <TabsContent value="staff" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Role Permissions</h3>
            <p className="text-muted-foreground">Manage what each role can access and modify</p>
            
            <div className="space-y-4">
              {["Owner", "Manager", "Receptionist", "Auditor"].map((role) => (
                <div key={role} className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold">{role}</p>
                    <p className="text-sm text-muted-foreground">
                      {role === "Owner" && "Full access to all features"}
                      {role === "Manager" && "Manage staff, view reports, process payments"}
                      {role === "Receptionist" && "Check-in/out, view rooms, process payments"}
                      {role === "Auditor" && "View reports and transaction logs"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <p className="text-muted-foreground">Configure accepted payment methods</p>
            
            <div className="space-y-4">
              {[
                { name: "Cash", enabled: true },
                { name: "POS Terminal", enabled: true },
                { name: "Bank Transfer", enabled: true },
                { name: "Mobile Money", enabled: false },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold">{method.name}</p>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </div>

            <Button variant="hero" onClick={handleSave}>Save Changes</Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div>
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <p className="text-muted-foreground">Configure security and access controls</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold">Auto Logout</p>
                    <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity</p>
                  </div>
                  <Switch
                    checked={preferences.autoLogout}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoLogout: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-semibold">IP Restriction</p>
                    <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-semibold">Integrations</h3>
              <p className="text-muted-foreground">Connect with external security systems (Future feature)</p>
              
              <div className="p-8 text-center border border-dashed border-border rounded-xl">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Security integrations coming soon</p>
                <p className="text-sm text-muted-foreground">CCTV, access control, and more</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">Display & Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme (recommended)</p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Enable Short-Stay</p>
                  <p className="text-sm text-muted-foreground">30-minute automatic billing for short stays</p>
                </div>
                <Switch
                  checked={preferences.shortStay}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, shortStay: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and alerts</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-semibold">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  checked={preferences.smsAlerts}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, smsAlerts: checked })}
                />
              </div>
            </div>

            <Button variant="hero" onClick={handleSave}>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
