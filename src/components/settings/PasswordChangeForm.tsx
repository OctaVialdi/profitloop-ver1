
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check, X } from "lucide-react";

export const PasswordChangeForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";
  
  const isValidPassword = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword) {
      toast.error("Password tidak memenuhi persyaratan keamanan");
      return;
    }
    
    if (!passwordsMatch) {
      toast.error("Password baru dan konfirmasi tidak sama");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;
      
      toast.success("Password berhasil diperbarui");
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="current-password">Password Saat Ini</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="new-password">Password Baru</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Konfirmasi Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {newPassword && confirmPassword && (
          <div className="text-sm">
            {passwordsMatch ? (
              <p className="text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" /> 
                Password sama
              </p>
            ) : (
              <p className="text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" /> 
                Password tidak sama
              </p>
            )}
          </div>
        )}
      </div>
      
      {newPassword && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">Persyaratan Password:</p>
          <ul className="space-y-1">
            <li className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
              {hasMinLength ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Minimal 8 karakter
            </li>
            <li className={`flex items-center ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
              {hasUpperCase ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Minimal 1 huruf besar
            </li>
            <li className={`flex items-center ${hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
              {hasLowerCase ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Minimal 1 huruf kecil
            </li>
            <li className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
              {hasNumber ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Minimal 1 angka
            </li>
            <li className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
              {hasSpecialChar ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
              Minimal 1 karakter khusus (!@#$%^&*.,?)
            </li>
          </ul>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading || !isValidPassword || !passwordsMatch}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Perbarui Password"
        )}
      </Button>
    </form>
  );
};
