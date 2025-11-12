import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OTPInputProps) {
  const handleChange = (index: number, inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, '');

    if (numericValue) {
      const newOtp = value.split('');
      newOtp[index] = numericValue;
      const updatedOtp = newOtp.join('').slice(0, length);
      onChange(updatedOtp);

      // Auto-focus next input
      if (index < length - 1 && numericValue) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={cn(
            'h-12 w-12 text-center text-lg font-semibold',
            'focus:ring-primary focus:border-primary focus:ring-2',
          )}
        />
      ))}
    </div>
  );
}
