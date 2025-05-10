
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BanknoteIcon, CreditCard, QrCode, Smartphone } from 'lucide-react';

type PaymentMethod = 'card' | 'id_bank_transfer' | 'qris' | 'ovo' | 'dana' | 'gopay';

interface PaymentMethodOptionsProps {
  onSelectionChange: (methods: PaymentMethod[]) => void;
  defaultMethod?: PaymentMethod;
}

const PaymentMethodOptions = ({ onSelectionChange, defaultMethod = 'card' }: PaymentMethodOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(defaultMethod);

  const handleMethodChange = (value: string) => {
    const method = value as PaymentMethod;
    setSelectedMethod(method);
    
    // Return appropriate methods based on selection
    const methodsMap: Record<PaymentMethod, PaymentMethod[]> = {
      'card': ['card'],
      'id_bank_transfer': ['id_bank_transfer'],
      'qris': ['qris', 'card'],
      'ovo': ['ovo', 'card'],
      'dana': ['dana', 'card'],
      'gopay': ['gopay', 'card']
    };
    
    onSelectionChange(methodsMap[method]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Pilih Metode Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          defaultValue={selectedMethod}
          value={selectedMethod}
          onValueChange={handleMethodChange}
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          <div>
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">Kartu Kredit/Debit</p>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="id_bank_transfer" id="id_bank_transfer" className="peer sr-only" />
            <Label
              htmlFor="id_bank_transfer"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <BanknoteIcon className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">Transfer Bank</p>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="qris" id="qris" className="peer sr-only" />
            <Label
              htmlFor="qris"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <QrCode className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">QRIS</p>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="gopay" id="gopay" className="peer sr-only" />
            <Label
              htmlFor="gopay"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Smartphone className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">GoPay</p>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="ovo" id="ovo" className="peer sr-only" />
            <Label
              htmlFor="ovo"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Smartphone className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">OVO</p>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="dana" id="dana" className="peer sr-only" />
            <Label
              htmlFor="dana"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Smartphone className="mb-3 h-6 w-6" />
              <p className="text-sm font-medium">DANA</p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodOptions;
