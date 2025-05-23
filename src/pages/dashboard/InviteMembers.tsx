
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization } from '@/hooks/useOrganization';

const InviteMembers = () => {
  const { organization, isAdmin } = useOrganization();
  const { toast } = useToast();

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tidak Dapat Diakses</CardTitle>
          <CardDescription>Anda tidak memiliki izin untuk mengakses halaman ini.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Fitur Undangan Tidak Tersedia</CardTitle>
          <CardDescription>
            Fitur untuk mengundang anggota saat ini tidak tersedia.
            Silakan hubungi administrator sistem untuk informasi lebih lanjut.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Fitur ini telah dinonaktifkan untuk sementara.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteMembers;
