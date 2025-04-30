
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Subscription = () => {
  // This would be fetched from Supabase after integration
  const organization = {
    name: "PT Example Corp",
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    subscription: "trial"
  };

  const plans = [
    {
      name: "Basic",
      price: "Rp 99.000",
      period: "/bulan",
      description: "Untuk tim kecil atau awal memulai",
      features: [
        "Hingga 5 anggota",
        "Fitur dasar",
        "Penyimpanan 5GB",
        "Email support"
      ],
      current: organization.subscription === "basic"
    },
    {
      name: "Standard",
      price: "Rp 249.000",
      period: "/bulan",
      description: "Untuk tim berkembang",
      features: [
        "Hingga 20 anggota",
        "Semua fitur Basic",
        "Penyimpanan 20GB",
        "Prioritas support",
        "Kolaborasi antar organisasi"
      ],
      popular: true,
      current: organization.subscription === "standard"
    },
    {
      name: "Premium",
      price: "Rp 499.000",
      period: "/bulan",
      description: "Untuk perusahaan besar",
      features: [
        "Anggota tidak terbatas",
        "Semua fitur Standard",
        "Penyimpanan 100GB",
        "Support 24/7",
        "API akses",
        "Keamanan tingkat lanjut"
      ],
      current: organization.subscription === "premium"
    },
  ];

  // Calculate days remaining in trial
  const daysRemaining = Math.ceil((organization.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleSubscribe = (planName: string) => {
    // This would be implemented after Supabase and payment integration
    toast.success(`Anda telah berhasil berlangganan paket ${planName}!`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kelola Subscription</h1>
          <p className="text-gray-600">Pilih paket yang sesuai dengan kebutuhan organisasi Anda</p>
        </header>

        {organization.subscription === "trial" && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-blue-800">
              <span className="font-medium">Periode Trial: </span>
              {daysRemaining} hari lagi sebelum trial berakhir. Berlangganan untuk terus menggunakan semua fitur.
            </p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Paling Populer
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.current ? (
                  <Button className="w-full" disabled>
                    Paket Saat Ini
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    Berlangganan
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
