'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { OTPInput } from '@/components/otp-input';
import { PhoneInput } from '@/components/phone-input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { sendOTP, verifyOTP, isLoading } = useAuth();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!mobile) {
      setError('Please enter a valid mobile number');
      return;
    }

    const result = await sendOTP(mobile);

    if (result.success) {
      setMessage(result.message);
      setStep('otp');
      setOtp(''); // Reset OTP when sending new code
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const result = await verifyOTP(mobile, otp);

    if (result.success) {
      if (result.login) {
        // User logged in successfully
        setMessage('Login successful!');
        router.push('/dashboard');
      } else {
        // User needs to complete profile
        router.push(`/register?mobile=${mobile}`);
      }

      // router.push(`/register?mobile=${mobile}`);
    } else {
      setError(result.message);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setMessage('');
    setOtp(''); // Reset OTP when resending
    const result = await sendOTP(mobile);

    if (result.success) {
      setMessage('OTP resent successfully');
    } else {
      setError(result.message);
    }
  };

  const handleBackToMobile = () => {
    setStep('mobile');
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center rounded-lg bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            {step === 'mobile'
              ? 'Enter your phone number'
              : 'Enter the code we texted you'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'mobile'
              ? 'We use your mobile number to identify your account'
              : `We've sent an SMS to ${mobile}`}
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {message && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {step === 'mobile' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div className="flex">
              <PhoneInput
                value={mobile}
                onChange={setMobile}
                placeholder="Enter mobile number"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !mobile}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackToMobile}
                disabled={isLoading}
                className="text-foreground text-sm"
              >
                Change mobile number
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-foreground text-sm"
              >
                Resend OTP
              </Button>
            </div>

            <Button
              type="submit"
              variant={'next_default'}
              disabled={isLoading || otp.length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
