import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Check, X, Clock, Send, Copy, RefreshCw, LinkIcon, Sparkles, Loader2, AlertCircle, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailTips } from "@/components/auth/EmailTips";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define invitation types
interface Invitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected' | 'sent';
  created_at: string;
  expires_at?: string;
  token?: string;
  organization_id?: string;
  role?: string;
}

interface MagicLinkInvitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  expires_at?: string;
  token?: string;
  organization_id?: string;
  role?: string;
}

const InviteMembers = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [isResending, setIsResending] = useState<{[key: string]: boolean}>({});
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [magicLinkInvitations, setMagicLinkInvitations] = useState<MagicLinkInvitation[]>([]);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>("");
  const [invitationLink, setInvitationLink] = useState<string>("");
  const [magicLinkUrl, setMagicLinkUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("magiclink");
  const [showEmailTips, setShowEmailTips] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  const [inviteFilter, setInviteFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user's organization id and existing invitations
  useEffect(() => {
    const fetchUserData = async () => {
      setIsRefreshing(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get user's organization
          const { data: profileData } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single();
          
          if (profileData && profileData.organization_id) {
            setOrganizationId(profileData.organization_id);
            
            // Get organization name
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', profileData.organization_id)
              .single();
              
            if (orgData) {
              setOrgName(orgData.name);
            }
            
            // Fetch existing email invitations
            const { data: invitationsData, error } = await supabase
              .from('invitations')
              .select('id, email, status, created_at, expires_at, token, role')
              .eq('organization_id', profileData.organization_id)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error("Error fetching invitations:", error);
              toast.error("Gagal memuat undangan yang ada.");
            } else {
              // Cast the status to the correct type
              const typedInvitations: Invitation[] = invitationsData?.map(inv => ({
                ...inv,
                status: (inv.status as 'pending' | 'accepted' | 'rejected' | 'sent') || 'pending'
              })) || [];
              
              setInvitations(typedInvitations);
            }
            
            // Fetch existing magic link invitations
            const { data: magicLinkData, error: magicLinkError } = await supabase
              .from('magic_link_invitations')
              .select('id, email, status, created_at, expires_at, token, role')
              .eq('organization_id', profileData.organization_id)
              .order('created_at', { ascending: false });
              
            if (magicLinkError) {
              console.error("Error fetching magic link invitations:", magicLinkError);
            } else {
              // Cast the status to the correct type
              const typedMagicLinks: MagicLinkInvitation[] = magicLinkData?.map(inv => ({
                ...inv,
                status: (inv.status as 'pending' | 'accepted' | 'rejected') || 'pending'
              })) || [];
              
              setMagicLinkInvitations(typedMagicLinks);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsRefreshing(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Add email to the list
  const addEmail = () => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      if (!emails.includes(emailInput)) {
        setEmails([...emails, emailInput]);
        setEmailInput("");
      } else {
        toast.error("Email ini sudah ada dalam daftar");
      }
    } else if (emailInput) {
      toast.error("Format email tidak valid");
    }
  };

  // Remove email from the list
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  // Handle Enter key in email input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationId) {
      toast.error("Tidak dapat menemukan organisasi Anda.");
      return;
    }
    
    // Check if we have emails to process
    const emailsToProcess = emails.length > 0 ? emails : (email ? [email] : []);
    
    if (emailsToProcess.length === 0) {
      toast.error("Masukkan minimal satu email untuk mengirim magic link");
      return;
    }
    
    setIsSendingMagicLink(true);
    setMagicLinkError(null);
    
    try {
      const successfulEmails: string[] = [];
      const failedEmails: string[] = [];
      let lastMagicLinkUrl = "";
      
      // Process each email
      for (const emailAddress of emailsToProcess) {
        try {
          // Check if user already exists in same organization
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', emailAddress)
            .eq('organization_id', organizationId)
            .maybeSingle();
            
          if (existingUser) {
            failedEmails.push(`${emailAddress} (sudah ada di organisasi)`);
            continue;
          }
          
          // Generate magic link using edge function
          const response = await supabase.functions.invoke('send-magic-link', {
            body: { 
              email: emailAddress, 
              organizationId,
              role 
            }
          });
          
          if (response.error) {
            throw new Error(response.error.message || "Gagal membuat magic link");
          }
          
          const data = response.data;
          
          // Store the magic link URL for the last email
          if (data.invitation_url) {
            lastMagicLinkUrl = data.invitation_url;
          }
  
          // Track success/failure
          if (data.email_sent) {
            successfulEmails.push(emailAddress);
          } else {
            failedEmails.push(emailAddress);
            setShowEmailTips(true);
            setMagicLinkError(data.email_error || "Gagal mengirim email, tetapi tautan Magic Link telah dibuat");
          }
        } catch (error) {
          console.error(`Error processing ${emailAddress}:`, error);
          failedEmails.push(emailAddress);
        }
      }
      
      // Set the last magic link URL for display
      if (lastMagicLinkUrl) {
        setMagicLinkUrl(lastMagicLinkUrl);
      }

      // Show results
      if (successfulEmails.length > 0) {
        if (successfulEmails.length === 1) {
          toast.success(`Magic Link telah dikirim ke ${successfulEmails[0]}`);
        } else {
          toast.success(`${successfulEmails.length} Magic Link berhasil dikirim`);
        }
      }
      
      if (failedEmails.length > 0) {
        toast.error(`Gagal mengirim ke: ${failedEmails.join(", ")}`);
      }
      
      // Refresh the list of magic link invitations
      const { data: magicLinkData } = await supabase
        .from('magic_link_invitations')
        .select('id, email, status, created_at, expires_at, token, role')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
        
      if (magicLinkData) {
        const typedMagicLinks: MagicLinkInvitation[] = magicLinkData.map(inv => ({
          ...inv,
          status: (inv.status as 'pending' | 'accepted' | 'rejected') || 'pending'
        }));
        
        setMagicLinkInvitations(typedMagicLinks);
      }
      
      // Clear inputs
      setEmail("");
      setEmails([]);
      
    } catch (error: any) {
      console.error("Magic Link error:", error);
      toast.error(error.message || "Gagal mengirim Magic Link. Silakan coba lagi.");
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  // Resend magic link invitation
  const handleResendMagicLink = async (invitationId: string, emailAddress: string) => {
    if (!organizationId) {
      toast.error("Tidak dapat menemukan organisasi Anda.");
      return;
    }
    
    setIsResending(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      // Generate magic link using edge function
      const response = await supabase.functions.invoke('send-magic-link', {
        body: { 
          email: emailAddress, 
          organizationId,
          role: 'employee' // Default role for resends
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Gagal mengirim ulang magic link");
      }
      
      const data = response.data;
      
      if (data.email_sent) {
        toast.success(`Magic Link telah dikirim ulang ke ${emailAddress}`);
      } else {
        toast.warning("Email tidak dapat dikirim, tetapi Magic Link telah diperbarui");
        setMagicLinkUrl(data.invitation_url);
        setShowEmailTips(true);
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error(error.message || "Gagal mengirim ulang Magic Link");
    } finally {
      setIsResending(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast.success("Tautan disalin ke clipboard");
        
        // Reset the copied status after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      },
      (err) => {
        console.error("Tidak dapat menyalin teks: ", err);
        toast.error("Gagal menyalin tautan");
      }
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Status display component
  const getStatusDisplay = (status: Invitation['status']) => {
    switch(status) {
      case 'pending':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Dibuat
          </div>
        );
      case 'sent':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Send className="h-3 w-3 mr-1" />
            Terkirim
          </div>
        );
      case 'accepted':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Diterima
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Ditolak
          </div>
        );
      default:
        return null;
    }
  };

  // Refresh invitations
  const handleRefresh = async () => {
    if (!organizationId) return;
    setIsRefreshing(true);
    
    try {
      // Refresh email invitations
      const { data: invitationsData, error } = await supabase
        .from('invitations')
        .select('id, email, status, created_at, expires_at, token, role')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Update invitations list
      const typedInvitations: Invitation[] = invitationsData?.map(inv => ({
        ...inv,
        status: (inv.status as 'pending' | 'accepted' | 'rejected' | 'sent') || 'pending'
      })) || [];
      
      setInvitations(typedInvitations);
      
      // Refresh magic link invitations
      const { data: magicLinkData, error: magicLinkError } = await supabase
        .from('magic_link_invitations')
        .select('id, email, status, created_at, expires_at, token, role')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
        
      if (magicLinkError) {
        throw magicLinkError;
      }
      
      // Update magic link invitations list
      const typedMagicLinks: MagicLinkInvitation[] = magicLinkData?.map(inv => ({
        ...inv,
        status: (inv.status as 'pending' | 'accepted' | 'rejected') || 'pending'
      })) || [];
      
      setMagicLinkInvitations(typedMagicLinks);
      
      toast.success("Daftar undangan diperbarui");
    } catch (error) {
      console.error("Error refreshing invitations:", error);
      toast.error("Gagal memperbarui daftar undangan");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter invitations by status
  const getFilteredInvitations = () => {
    if (inviteFilter === "all") return magicLinkInvitations;
    return magicLinkInvitations.filter(inv => inv.status === inviteFilter);
  };

  const filteredInvitations = getFilteredInvitations();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Undang Anggota</h1>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="email">Via Email</TabsTrigger>
            <TabsTrigger value="link">Via Tautan</TabsTrigger>
            <TabsTrigger value="magiclink">
              <span className="flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                Magic Link
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <CardTitle>Undang via Email</CardTitle>
                </div>
                <CardDescription>
                  Kirim undangan melalui email kepada anggota baru untuk bergabung dengan organisasi Anda
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
                  <Button type="submit" disabled={isLoading || !organizationId}>
                    {isLoading ? "Mengirim..." : "Kirim Undangan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="link">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle>Undang via Tautan</CardTitle>
                </div>
                <CardDescription>
                  Buat tautan undangan yang dapat Anda bagikan kepada calon anggota tim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkEmail">Email</Label>
                    <Input
                      id="linkEmail"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500">Email penerima undangan</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkRole">Peran</Label>
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
                  
                  <Button 
                    onClick={handleGenerateLink} 
                    disabled={isLoading || !email || !organizationId}
                  >
                    {isLoading ? "Menyiapkan..." : "Buat Tautan Undangan"}
                  </Button>
                  
                  {invitationLink && (
                    <div className="mt-4">
                      <Alert className="bg-blue-50 border-blue-100">
                        <AlertTitle className="text-blue-700">Tautan Undangan Siap</AlertTitle>
                        <AlertDescription>
                          <div className="mt-2 space-y-3">
                            <div className="p-3 bg-white rounded border border-blue-100 flex items-start">
                              <div className="flex-1 overflow-auto text-sm">
                                {invitationLink}
                              </div>
                              <Button
                                variant="ghost" 
                                size="icon" 
                                className="ml-2 flex-shrink-0" 
                                onClick={() => copyToClipboard(invitationLink)}
                              >
                                <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-blue-700">
                              Salin dan bagikan tautan ini kepada {email}. Mereka akan bisa bergabung ke {orgName} setelah mendaftar.
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="magiclink" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Undang via Magic Link</CardTitle>
                </div>
                <CardDescription>
                  Kirim undangan Magic Link yang memungkinkan anggota bergabung tanpa perlu membuat password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMagicLink} className="space-y-6">
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
                    <p className="text-sm text-gray-500">Peran untuk semua undangan yang akan dikirim</p>
                  </div>
                  
                  {/* Single email input */}
                  {emails.length === 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {/* Multiple emails input */}
                  <div className="space-y-2">
                    <Label htmlFor="multi-email">
                      {emails.length === 0 ? "Atau undang beberapa orang sekaligus" : "Daftar Email"}
                    </Label>
                    
                    {/* Email chips */}
                    {emails.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {emails.map((email) => (
                          <div key={email} className="flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1">
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => removeEmail(email)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Email input with add button */}
                    <div className="flex gap-2">
                      <Input
                        id="multi-email"
                        type="email"
                        placeholder="Masukkan email dan tekan Enter"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={addEmail} 
                        variant="outline"
                      >
                        Tambah
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Tekan Enter atau klik Tambah untuk menambahkan email ke daftar
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSendingMagicLink || (!email && emails.length === 0) || !organizationId}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSendingMagicLink ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {emails.length > 1 ? `Mengirim ke ${emails.length} orang...` : "Mengirim..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {emails.length > 1 ? `Kirim ${emails.length} Magic Link` : "Kirim Magic Link"}
                      </>
                    )}
                  </Button>
                </form>
                
                {magicLinkError && (
                  <div className="mt-4">
                    <Alert variant="destructive" className="mb-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Gagal mengirim email</AlertTitle>
                      <AlertDescription>
                        {magicLinkError}. Anda masih dapat menggunakan tautan di bawah ini.
                      </AlertDescription>
                    </Alert>
                    
                    <EmailTips showTip={showEmailTips} />
                  </div>
                )}
                
                {magicLinkUrl && (
                  <div className="mt-6">
                    <Alert className="bg-indigo-50 border-indigo-100">
                      <AlertTitle className="text-indigo-700">Magic Link Siap</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-3">
                          <div className="p-3 bg-white rounded border border-indigo-100 flex items-start">
                            <div className="flex-1 overflow-auto text-sm break-all">
                              {magicLinkUrl}
                            </div>
                            <Button
                              variant="ghost" 
                              size="icon" 
                              className="ml-2 flex-shrink-0" 
                              onClick={() => copyToClipboard(magicLinkUrl)}
                            >
                              <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
                            </Button>
                          </div>
                          <p className="text-sm text-indigo-700">
                            {magicLinkError 
                              ? "Salin tautan di atas dan kirim secara manual"
                              : "Magic Link telah dikirim melalui email. Penerima dapat bergabung dengan organisasi tanpa perlu membuat password."}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg border shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Riwayat Magic Link</h2>
                <div className="flex space-x-2">
                  <Select 
                    value={inviteFilter} 
                    onValueChange={setInviteFilter}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="accepted">Diterima</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Peran</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead>Kadaluarsa</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvitations.length > 0 ? (
                      filteredInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell className="capitalize">
                            {invitation.role || 'karyawan'}
                          </TableCell>
                          <TableCell>{getStatusDisplay(invitation.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(invitation.created_at)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {invitation.expires_at ? formatDate(invitation.expires_at) : "-"}
                          </TableCell>
                          <TableCell>
                            {invitation.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleResendMagicLink(invitation.id, invitation.email)}
                                disabled={isResending[invitation.id]}
                              >
                                {isResending[invitation.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCw className="h-4 w-4" />
                                )}
                                <span className="ml-2">Kirim Ulang</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Tidak ada data undangan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InviteMembers;
