"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserSyncData {
  email: string;
  customUserId: string;
  authUserId: string | null;
  hasMismatch: boolean;
  hasMetadata: boolean;
  display_name: string;
  status: string;
  note?: string;
}

interface SyncSummary {
  total: number;
  withMismatches: number;
  withoutAuth: number;
}

const UserSyncPage = () => {
  const [users, setUsers] = useState<UserSyncData[]>([]);
  const [summary, setSummary] = useState<SyncSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncEmail, setSyncEmail] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const fetchUserSyncData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/fix-user-ids");
      
      if (!response.ok) {
        throw new Error("Failed to fetch user sync data");
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      setSummary({
        total: data.total,
        withMismatches: data.withMismatches,
        withoutAuth: data.withoutAuth
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching user sync data:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async (email: string) => {
    try {
      setSyncLoading(true);
      setSyncResult(null);
      
      const response = await fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      setSyncResult(result);
      
      if (response.ok) {
        // Refresh the user list
        await fetchUserSyncData();
      }
    } catch (err) {
      setSyncResult({ error: err instanceof Error ? err.message : "An error occurred" });
      console.error("Error syncing user:", err);
    } finally {
      setSyncLoading(false);
    }
  };

  const fixUserIds = async (email: string) => {
    try {
      setSyncLoading(true);
      setSyncResult(null);
      
      const response = await fetch("/api/fix-user-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      setSyncResult(result);
      
      if (response.ok) {
        // Refresh the user list
        await fetchUserSyncData();
      }
    } catch (err) {
      setSyncResult({ error: err instanceof Error ? err.message : "An error occurred" });
      console.error("Error fixing user IDs:", err);
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSyncData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User ID Synchronization</h1>
        <Button onClick={fetchUserSyncData} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>With ID Mismatches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{summary.withMismatches}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Without Auth Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.withoutAuth}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manual User Sync</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="sync-email">Email Address</Label>
              <Input
                id="sync-email"
                type="email"
                value={syncEmail}
                onChange={(e) => setSyncEmail(e.target.value)}
                placeholder="Enter email to sync"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                onClick={() => syncUser(syncEmail)} 
                disabled={!syncEmail || syncLoading}
              >
                {syncLoading ? "Syncing..." : "Sync User"}
              </Button>
              <Button 
                onClick={() => fixUserIds(syncEmail)} 
                disabled={!syncEmail || syncLoading}
                variant="outline"
              >
                Fix IDs
              </Button>
            </div>
          </div>
          
          {syncResult && (
            <div className={`p-4 rounded border ${
              syncResult.error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <pre className="text-sm">{JSON.stringify(syncResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Synchronization Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.email} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{user.display_name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {user.hasMismatch && (
                      <Badge variant="destructive">ID Mismatch</Badge>
                    )}
                    {!user.authUserId && (
                      <Badge variant="secondary">No Auth User</Badge>
                    )}
                    {user.hasMetadata && (
                      <Badge variant="default">Has Metadata</Badge>
                    )}
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Custom Table ID:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {user.customUserId}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Auth User ID:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                      {user.authUserId || 'N/A'}
                    </code>
                  </div>
                </div>
                
                {user.note && (
                  <p className="text-sm text-gray-600 italic">{user.note}</p>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => syncUser(user.email)}
                    disabled={syncLoading}
                  >
                    Sync
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => fixUserIds(user.email)}
                    disabled={syncLoading || !user.authUserId}
                  >
                    Fix IDs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSyncPage; 