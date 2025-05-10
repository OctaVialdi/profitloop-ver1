
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";

const SubscriptionFaq = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { organization } = useOrganization();
  
  // FAQ items with questions and answers
  const faqItems = [
    {
      id: "1",
      question: "Apa saja yang termasuk dalam paket langganan?",
      answer: "Paket langganan kami mencakup akses ke semua fitur premium seperti manajemen karyawan tanpa batas, modul pelaporan lanjutan, integrasi dengan sistem penggajian, dan dukungan pelanggan prioritas. Anda juga mendapatkan akses ke fitur baru yang akan dirilis di masa mendatang."
    },
    {
      id: "2",
      question: "Bagaimana cara berlangganan?",
      answer: "Untuk berlangganan, pilih paket yang sesuai dengan kebutuhan Anda di halaman Langganan, lalu klik tombol 'Berlangganan'. Anda akan diarahkan ke halaman pembayaran aman. Setelah pembayaran berhasil, akses premium akan langsung aktif di akun Anda."
    },
    {
      id: "3",
      question: "Apakah saya dapat mengubah paket langganan?",
      answer: "Ya, Anda dapat mengubah paket langganan kapan saja. Cukup masuk ke Dashboard Langganan dan klik 'Kelola Langganan'. Jika Anda meningkatkan (upgrade) paket, biaya akan disesuaikan secara pro-rata. Jika Anda menurunkan (downgrade) paket, perubahan akan berlaku pada periode penagihan berikutnya."
    },
    {
      id: "4",
      question: "Bagaimana cara membatalkan langganan?",
      answer: "Untuk membatalkan langganan, masuk ke Dashboard Langganan dan klik 'Kelola Langganan'. Dari portal pelanggan, pilih opsi 'Batalkan Langganan'. Akses premium Anda akan tetap aktif hingga akhir periode penagihan saat ini. Kami tidak menawarkan pengembalian dana untuk periode yang belum terpakai."
    },
    {
      id: "5",
      question: "Apakah ada trial sebelum berlangganan?",
      answer: "Ya, kami menawarkan trial gratis selama 14 hari dengan akses ke semua fitur premium. Anda tidak perlu memasukkan informasi pembayaran untuk memulai trial. Setelah periode trial berakhir, Anda dapat memilih untuk berlangganan atau tetap menggunakan versi dasar dengan fitur terbatas."
    },
    {
      id: "6",
      question: "Metode pembayaran apa yang diterima?",
      answer: "Kami menerima pembayaran melalui kartu kredit (Visa, Mastercard, American Express), kartu debit, dan transfer bank untuk langganan tahunan. Semua pembayaran diproses melalui platform pembayaran yang aman dan terenkripsi."
    },
    {
      id: "7",
      question: "Apakah data saya aman jika saya membatalkan langganan?",
      answer: "Ya, data Anda tetap aman dan tersimpan setelah membatalkan langganan. Akun Anda akan dikonversi ke versi dasar, namun Anda tetap dapat mengakses data yang telah Anda masukkan. Beberapa fitur premium mungkin tidak lagi tersedia, tetapi data yang terkait dengan fitur tersebut tidak akan hilang."
    },
    {
      id: "8",
      question: "Bisakah saya meminta perpanjangan masa trial?",
      answer: "Ya, Anda dapat meminta perpanjangan masa trial jika Anda memerlukan waktu tambahan untuk mengevaluasi platform. Kunjungi halaman 'Permintaan Perpanjangan Trial' dari Dashboard Langganan dan jelaskan alasan Anda. Tim kami akan meninjau permintaan Anda dan memberikan respons dalam waktu 1-2 hari kerja."
    },
    {
      id: "9",
      question: "Apakah ada diskon untuk pembayaran tahunan?",
      answer: "Ya, kami menawarkan diskon 15% untuk pelanggan yang memilih paket langganan tahunan. Ini memberikan penghematan yang signifikan dibandingkan dengan pembayaran bulanan dan juga mengunci harga untuk jangka waktu satu tahun penuh."
    },
    {
      id: "10",
      question: "Bagaimana jika saya memerlukan lebih banyak anggota?",
      answer: "Setiap paket langganan mencakup jumlah anggota tertentu. Jika Anda memerlukan lebih banyak anggota, Anda dapat meningkatkan ke paket yang lebih tinggi atau menghubungi tim dukungan kami untuk membahas pilihan kustom untuk organisasi besar."
    }
  ];
  
  // Filter FAQ items based on search query
  const filteredFaqItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Track FAQ search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2 && organization?.id) {
      subscriptionAnalyticsService.trackEvent({
        eventType: 'premium_feature_clicked', // Using existing valid event type
        organizationId: organization.id,
        additionalData: { 
          searchType: 'faq_search',
          query 
        }
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Pertanyaan Umum</h1>
        <p className="text-gray-600">
          Temukan jawaban untuk pertanyaan umum tentang langganan dan fitur premium
        </p>
      </div>
      
      {/* Search bar */}
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari pertanyaan atau kata kunci..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Langganan</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFaqItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqItems.map(item => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Tidak ada hasil ditemukan untuk "{searchQuery}".
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Reset Pencarian
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Additional Help Section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">
          Belum menemukan jawaban?
        </h3>
        <p className="text-blue-600 mb-4">
          Tim dukungan kami siap membantu dengan pertanyaan spesifik tentang langganan atau fitur premium.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-white">
            Hubungi Dukungan
          </Button>
          <Button variant="outline" className="bg-white">
            Jadwalkan Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFaq;
