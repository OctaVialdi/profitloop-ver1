
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";

interface AuthenticationTabProps {
  email: string;
  onSignOutFromAllSessions: () => void;
}

export const AuthenticationTab = ({ email, onSignOutFromAllSessions }: AuthenticationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Autentikasi</CardTitle>
        <CardDescription>Perubahan pada autentikasi akan berlaku untuk semua akun Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="email-auth">Email</Label>
          <Input
            type="email"
            id="email-auth"
            value={email}
            disabled
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="font-medium text-lg mb-4">Ubah Password</h3>
          <PasswordChangeForm />
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Keluar dari Semua Sesi Aktif</h3>
              <p className="text-sm text-muted-foreground">Paksa logout dari semua perangkat dan sesi Anda</p>
            </div>
            <Button variant="outline" onClick={onSignOutFromAllSessions}>
              Keluar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
