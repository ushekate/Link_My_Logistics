'use client';
import Button from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

import pb from '@/lib/db';
import {
  ChartSpline,
  Eye,
  EyeClosed,
  Lock,
  Mail,
  Package,
  Phone,
  ShieldHalf,
  Truck,
  UserRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
// import { ROLES } from '@/constants/roles';

export default function CustomerRegistrationPage() {
  const router = useRouter();

  const progress = [
    { n: 1, h: "Register" },
    { n: 2, h: "Profile" },
    { n: 3, h: "Verification" },
    { n: 4, h: "Completed" },
  ];

  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Check if all required fields are filled
  const allRequiredFilled =
    formData.username.trim() !== '' &&
    formData.firstname.trim() !== '' &&
    formData.lastname.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allRequiredFilled) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        email: formData.email,
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        password: formData.password,
        passwordConfirm: formData.password,
        role: "Customer",
      };

      const res = await pb.collection('users').create(data);

      if (res) {
        localStorage.setItem('customerId', JSON.stringify(res.id));
        toast.success('Account created successfully!');
        router.push('/customer/register/profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.data?.data) {
        // Handle specific field errors
        const errors = error.data.data;
        if (errors.email) {
          toast.error('Email is already registered');
        } else if (errors.username) {
          toast.error('Username is already taken');
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { user, LoginWithGoogle } = useAuth();
  
  const handleLoginWithGoogle = async (e) => {
    e.preventDefault();
    try {
      const res = await LoginWithGoogle('Customer');
      if (res.isAuthenticated) {
        console.log(res);
        toast.success(res.message)
        router.push('/customer/register/success');
      }
      console.log(res);
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  useEffect(() => {
      if (user) {
        router.push('/customer/register')
      }
    }, [user]);

  return (
    <div className="relative z-10 w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: 'url("/cargo-ship.png")' }}
    >
      <div className="absolute -z-[1] top-0 left-0 w-full min-h-screen bg-black/60"></div>

      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-sm font-bold text-primary">Green Ocean Logistics</div>
          <h2 className="text-2xl font-semibold text-primary mt-2">Create Customer Account</h2>
          <p className="text-sm text-gray-600 mt-1">Join our logistics platform</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {progress.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${index === 0 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                  {step.n}
                </div>
                <span className="text-xs mt-1 text-gray-600">{step.h}</span>
              </div>
            ))}
          </div>
          <Progress value={25} className="h-2" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Username *"
              value={formData.username}
              onChange={handleChange('username')}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.firstname}
                onChange={handleChange('firstname')}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Last Name *"
                value={formData.lastname}
                onChange={handleChange('lastname')}
                className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange('phone')}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange('email')}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a Strong Password *"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={8}
            />
            <div
              className="absolute right-3 top-4 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
              }}
              className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <div
              className="absolute right-3 top-4 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!allRequiredFilled || isSubmitting}
            className={`w-full h-12 rounded-md font-semibold text-lg mt-6 transition flex items-center justify-center gap-2 ${allRequiredFilled && !isSubmitting
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Account...
              </>
            ) : (
              <>
                Next <span className="ml-2">&#8594;</span>
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-700 text-sm">
            Already have an account?
            <a
              href="/customer/login"
              className="text-primary ml-1 font-medium hover:underline"
            >
              Sign In
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center w-full my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}

          <Button
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
            type='button'
            icon={<FcGoogle />}
            title={'Login with Google'}
            onClick={handleLoginWithGoogle}
          />
          
        </form>
      </div>
    </div>
  );
}
