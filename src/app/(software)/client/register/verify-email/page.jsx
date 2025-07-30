'use client';

import { Progress } from "@/components/ui/progress";
import pb from '@/lib/db';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Mail,
    Package,
    RefreshCw
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isVerified: false,
    isResending: false,
    isChecking: false,
    error: null,
    userEmail: null,
    userId: null,
    countdown: 0
  });

  const progress = [
    { n: 1, h: "Account" },
    { n: 2, h: "Verify Email" },
    { n: 3, h: "Business" },
    { n: 4, h: "Complete" },
  ];

  useEffect(() => {
    // Get user email and ID from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    const storedUserId = localStorage.getItem('userId');

    if (storedEmail) {
      setVerificationState(prev => ({
        ...prev,
        userEmail: JSON.parse(storedEmail)
      }));
    }

    if (storedUserId) {
      setVerificationState(prev => ({
        ...prev,
        userId: JSON.parse(storedUserId)
      }));
    }

    // If token is present in URL, verify automatically
    if (token) {
      handleVerification(token);
    }

    // Set up real-time subscription to monitor user verification status
    let unsubscribe = null;

    if (storedUserId) {
      const userId = JSON.parse(storedUserId);

      // Subscribe to real-time updates for this specific user
      pb.collection('users').subscribe(userId, function (e) {
        console.log('Real-time update received:', e);

        // Check if the user's verification status changed
        if (e.action === 'update' && e.record) {
          const user = e.record;

          // If user is now verified, redirect to business info
          if (user.verified && !verificationState.isVerified) {
            console.log('User verified via real-time update!');
            setVerificationState(prev => ({
              ...prev,
              isVerified: true,
              isVerifying: false
            }));
            toast.success('Email verified successfully!');

            // Wait a moment then redirect to business info
            setTimeout(() => {
              router.push('/client/register/BusinessInfo');
            }, 2000);
          }
        }
      }).catch(error => {
        console.error('Failed to subscribe to real-time updates:', error);
      });

      // Store unsubscribe function
      unsubscribe = () => {
        pb.collection('users').unsubscribe(userId);
      };
    }

    // Set up polling as a fallback mechanism
    let pollingInterval = null;

    if (storedUserId && !verificationState.isVerified) {
      const userId = JSON.parse(storedUserId);

      pollingInterval = setInterval(async () => {
        try {
          const user = await pb.collection('users').getOne(userId);

          if (user.verified && !verificationState.isVerified) {
            console.log('User verified via polling!');
            setVerificationState(prev => ({
              ...prev,
              isVerified: true,
              isVerifying: false
            }));
            toast.success('Email verified successfully!');

            // Clear polling
            clearInterval(pollingInterval);

            // Wait a moment then redirect to business info
            setTimeout(() => {
              router.push('/client/register/BusinessInfo');
            }, 2000);
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 5000); // Poll every 5 seconds
    }

    // Cleanup subscription and polling on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [token, router, verificationState.isVerified]);

  const handleVerification = async (verificationToken) => {
    setVerificationState(prev => ({ ...prev, isVerifying: true, error: null }));

    try {
      await pb.collection('users').confirmVerification(verificationToken);

      setVerificationState(prev => ({ ...prev, isVerified: true, isVerifying: false }));
      toast.success('Email verified successfully!');

      // Wait a moment then redirect to business info
      setTimeout(() => {
        router.push('/client/register/BusinessInfo');
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        error: 'Invalid or expired verification token. Please request a new one.'
      }));
      toast.error('Email verification failed');
    }
  };

  const handleResendVerification = async () => {
    if (!verificationState.userEmail) {
      toast.error('No email address found. Please register again.');
      router.push('/client/register');
      return;
    }

    setVerificationState(prev => ({ ...prev, isResending: true, error: null }));

    try {
      await pb.collection('users').requestVerification(verificationState.userEmail);
      toast.success('Verification email sent! Please check your inbox.');

      // Start countdown
      setVerificationState(prev => ({ ...prev, isResending: false, countdown: 60 }));

      const countdownInterval = setInterval(() => {
        setVerificationState(prev => {
          if (prev.countdown <= 1) {
            clearInterval(countdownInterval);
            return { ...prev, countdown: 0 };
          }
          return { ...prev, countdown: prev.countdown - 1 };
        });
      }, 1000);

    } catch (error) {
      console.error('Resend error:', error);
      setVerificationState(prev => ({ ...prev, isResending: false }));
      toast.error('Failed to resend verification email');
    }
  };

  const handleCheckVerificationStatus = async () => {
    if (!verificationState.userId) {
      toast.error('No user ID found. Please register again.');
      router.push('/client/register');
      return;
    }

    setVerificationState(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const user = await pb.collection('users').getOne(verificationState.userId);

      if (user.verified) {
        setVerificationState(prev => ({
          ...prev,
          isVerified: true,
          isChecking: false
        }));
        toast.success('Email verified successfully!');

        // Wait a moment then redirect to business info
        setTimeout(() => {
          router.push('/client/register/BusinessInfo');
        }, 2000);
      } else {
        setVerificationState(prev => ({ ...prev, isChecking: false }));
        toast.info('Email not yet verified. Please check your inbox.');
      }
    } catch (error) {
      console.error('Check verification error:', error);
      setVerificationState(prev => ({ ...prev, isChecking: false }));
      toast.error('Failed to check verification status');
    }
  };

  const handleBackToRegister = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    router.push('/client/register');
  };

  if (verificationState.isVerified) {
    return (
      <div className="w-full min-h-screen flex bg-primary">
        {/* Left Panel */}
        <div className="bg-primary w-1/2 flex flex-col items-center justify-center px-10">
          <div className="text-center">
            <CheckCircle size={80} className="text-white mx-auto mb-6" />
            <h1 className="text-white font-bold text-3xl mb-4">Email Verified!</h1>
            <p className="text-white text-lg max-w-md">
              Your email has been successfully verified. Redirecting you to complete your business information...
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col w-1/2 min-h-screen items-center justify-center bg-[#F9FAFB] px-8">
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="flex justify-between w-full mb-3 mt-5">
              <h1 className="text-black">Step 2 of 4</h1>
              <h1 className="text-[#6B7280]">Verify Email</h1>
            </div>
            <Progress value={50} className="bg-[#E5E7EB]" />

            <div className="flex justify-center gap-10 lg:gap-18">
              {progress.map((prog, idx) => (
                <div key={idx} className="flex flex-col items-center mt-2">
                  <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${
                    idx <= 1 ? 'bg-primary text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                  }`}>
                    {idx <= 1 ? <CheckCircle size={20} /> : prog.n}
                  </div>
                  <div className={`mt-1 text-sm ${idx <= 1 ? 'text-[#4B5563]' : 'text-primary'}`}>
                    {prog.h}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Redirecting to business information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex bg-primary">
      {/* Left Panel */}
      <div className="bg-primary w-1/2 flex flex-col items-center justify-center px-10">
        <div className="text-center">
          <Mail size={80} className="text-white mx-auto mb-6" />
          <h1 className="text-white font-bold text-3xl mb-4">Check Your Email</h1>
          <p className="text-white text-lg max-w-md mb-6">
            We've sent a verification link to your email address. Please click the link to verify your account.
          </p>
          {verificationState.userEmail && (
            <p className="text-white/80 text-sm">
              Sent to: {verificationState.userEmail}
            </p>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-1/2 min-h-screen items-center justify-center bg-[#F9FAFB] px-8">
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="flex justify-between w-full mb-3 mt-5">
            <h1 className="text-black">Step 2 of 4</h1>
            <h1 className="text-[#6B7280]">Verify Email</h1>
          </div>
          <Progress value={50} className="bg-[#E5E7EB]" />

          <div className="flex justify-center gap-10 lg:gap-18">
            {progress.map((prog, idx) => (
              <div key={idx} className="flex flex-col items-center mt-2">
                <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${
                  idx === 0 ? 'bg-primary text-white' :
                  idx === 1 ? 'bg-yellow-500 text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                }`}>
                  {idx === 0 ? <CheckCircle size={20} /> : prog.n}
                </div>
                <div className={`mt-1 text-sm ${
                  idx === 0 ? 'text-[#4B5563]' :
                  idx === 1 ? 'text-yellow-600' : 'text-primary'
                }`}>
                  {prog.h}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center mt-8 mb-6">
            <Package className="text-white bg-primary p-2 h-10 w-10 rounded-lg mr-3" />
            <span className="text-2xl font-extrabold text-[#1A2E22]">Logistics</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-extrabold text-2xl text-[#1A2E22] mb-4">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to your address. Please check your inbox and click the verification link.
            </p>

            <div className="flex items-center justify-center mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-700 text-sm font-medium">
                  Monitoring verification status in real-time
                </span>
              </div>
            </div>

            {verificationState.error && (
              <div className="flex items-center justify-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="text-red-600 text-sm">{verificationState.error}</span>
              </div>
            )}

            {verificationState.isVerifying && (
              <div className="flex items-center justify-center mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Loader2 size={16} className="animate-spin text-blue-600 mr-2" />
                <span className="text-blue-600 text-sm">Verifying your email...</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleCheckVerificationStatus}
              disabled={verificationState.isChecking}
              className={`w-full h-12 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                verificationState.isChecking
                  ? 'bg-blue-300 text-blue-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {verificationState.isChecking ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Check Verification Status
                </>
              )}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={verificationState.isResending || verificationState.countdown > 0}
              className={`w-full h-12 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                verificationState.isResending || verificationState.countdown > 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {verificationState.isResending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending...
                </>
              ) : verificationState.countdown > 0 ? (
                <>
                  <RefreshCw size={20} />
                  Resend in {verificationState.countdown}s
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              onClick={handleBackToRegister}
              className="w-full h-12 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Registration
            </button>
          </div>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex bg-primary items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}