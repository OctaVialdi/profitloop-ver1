
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import SubscriptionStatusBadge from '@/components/subscription/SubscriptionStatusBadge';

const SubscriptionFAQPage = () => {
  const { hasPaidSubscription, isTrialActive } = useOrganization();

  const faqItems = [
    {
      question: "Apa saja paket langganan yang tersedia?",
      answer: (
        <div className="space-y-2">
          <p>Kami menawarkan beberapa paket langganan:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Basic:</strong> Akses dasar untuk fitur standar (gratis).</li>
            <li><strong>Pro:</strong> Akses ke semua fitur dengan batasan penggunaan bulanan.</li>
            <li><strong>Enterprise:</strong> Penggunaan tidak terbatas dan fitur analitik lanjutan.</li>
          </ul>
          <p className="pt-2">
            <Link to="/settings/subscription" className="text-primary hover:underline">
              Lihat detail lengkap paket
            </Link>
          </p>
        </div>
      )
    },
    {
      question: "Berapa lama masa uji coba (trial)?",
      answer: (
        <div>
          <p>Masa uji coba berlangsung selama 14 hari. Selama periode ini, Anda bisa mencoba semua fitur premium tanpa biaya.</p>
          <p className="mt-2">Setelah masa uji coba berakhir, Anda perlu berlangganan untuk terus menggunakan fitur premium.</p>
        </div>
      )
    },
    {
      question: "Bagaimana cara berlangganan?",
      answer: (
        <div>
          <p>Untuk berlangganan, ikuti langkah-langkah berikut:</p>
          <ol className="list-decimal pl-6 space-y-1 mt-2">
            <li>Kunjungi halaman <Link to="/settings/subscription" className="text-primary hover:underline">Langganan</Link></li>
            <li>Pilih paket yang sesuai dengan kebutuhan Anda</li>
            <li>Klik tombol "Berlangganan" atau "Mulai"</li>
            <li>Masukkan detail pembayaran Anda</li>
            <li>Konfirmasi pembayaran</li>
          </ol>
        </div>
      )
    },
    {
      question: "Apakah saya bisa mengganti paket langganan?",
      answer: (
        <p>Ya, Anda bisa mengubah paket langganan kapan saja. Jika Anda meningkatkan (upgrade), perubahan akan langsung efektif. Jika Anda menurunkan (downgrade), perubahan akan berlaku pada periode penagihan berikutnya.</p>
      )
    },
    {
      question: "Bagaimana cara membatalkan langganan?",
      answer: (
        <div>
          <p>Untuk membatalkan langganan:</p>
          <ol className="list-decimal pl-6 space-y-1 mt-2">
            <li>Kunjungi halaman <Link to="/settings/subscription" className="text-primary hover:underline">Langganan</Link></li>
            <li>Klik tombol "Kelola Langganan"</li>
            <li>Pilih "Batalkan Langganan"</li>
            <li>Konfirmasi pembatalan</li>
          </ol>
          <p className="mt-2">Setelah dibatalkan, Anda masih bisa menggunakan fitur premium hingga akhir periode penagihan saat ini.</p>
        </div>
      )
    },
    {
      question: "Apa metode pembayaran yang didukung?",
      answer: (
        <div>
          <p>Kami mendukung berbagai metode pembayaran, termasuk:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Kartu kredit (Visa, Mastercard, American Express)</li>
            <li>Kartu debit yang didukung Visa/Mastercard</li>
            <li>PayPal</li>
            <li>Transfer bank (untuk langganan tahunan Enterprise)</li>
          </ul>
        </div>
      )
    },
    {
      question: "Bagaimana jika saya memiliki pertanyaan lain?",
      answer: (
        <p>Jika Anda memiliki pertanyaan lain, silakan hubungi tim dukungan kami melalui email di <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a> atau melalui fitur chat di aplikasi.</p>
      )
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">FAQ Langganan</CardTitle>
              <CardDescription className="mt-2">
                Pertanyaan umum tentang model langganan kami
              </CardDescription>
            </div>
            <div>
              <SubscriptionStatusBadge size="lg" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg border">
            <h3 className="font-semibold mb-2">Status Langganan Anda</h3>
            <p>
              {hasPaidSubscription ? (
                "Anda saat ini berlangganan paket premium. Nikmati akses ke semua fitur."
              ) : isTrialActive ? (
                "Anda dalam masa uji coba. Silakan berlangganan untuk terus menikmati fitur premium."
              ) : (
                "Masa uji coba Anda telah berakhir. Berlangganan sekarang untuk mengakses fitur premium."
              )}
            </p>
            <div className="mt-4">
              <Link 
                to="/settings/subscription" 
                className="text-primary hover:underline text-sm font-medium"
              >
                {hasPaidSubscription 
                  ? "Kelola Langganan" 
                  : "Berlangganan Sekarang"}
              </Link>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionFAQPage;
