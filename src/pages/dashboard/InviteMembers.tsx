
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail } from "lucide-react";

const InviteMembers = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This will be implemented after Supabase integration
      console.log("Inviting member:", { email, role });
      
      // Mock successful invitation for demonstration
      toast.success(`Undangan telah dikirim ke ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Invitation error:", error);
      toast.error("Gagal mengirim undangan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Undang Anggota</h1>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <CardTitle>Undang Anggota Baru</CardTitle>
            </div>
            <CardDescription>
              Kirim undangan kepada anggota baru untuk bergabung dengan organisasi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Karyawan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Undangan"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Undangan Terkirim</h2>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-center py-8 text-gray-500">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>Belum ada undangan yang dikirim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
