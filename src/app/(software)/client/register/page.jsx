'use client';
import { Progress } from "@/components/ui/progress";
import pb from '@/lib/db';
import {
    AlertCircle,
    ChartSpline,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Package,
    Phone,
    ShieldHalf,
    Truck,
    UserRound
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

export default function RegistrationLoginPage() {
  const router = useRouter();

  const progress = [
    { n: 1, h: "Account" },
    { n: 2, h: "Verify Email" },
    { n: 3, h: "Business" },
    { n: 4, h: "Complete" },
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

  const [formState, setFormState] = useState({
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    termsAccepted: false,
    errors: {},
    isSubmitting: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];

    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.uppercase) feedback.push('One uppercase letter');
    if (!checks.lowercase) feedback.push('One lowercase letter');
    if (!checks.number) feedback.push('One number');
    if (!checks.special) feedback.push('One special character');

    return { score, feedback, isValid: score >= 4 };
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstname.trim()) errors.firstname = 'First name is required';
    if (!formData.lastname.trim()) errors.lastname = 'Last name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!validateEmail(formData.email)) errors.email = 'Valid email is required';
    if (!validatePassword(formData.password).isValid) errors.password = 'Password does not meet requirements';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formState.termsAccepted) errors.terms = 'You must accept the terms and conditions';

    return errors;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    // Clear field error when user starts typing
    if (formState.errors[field]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: null }
      }));
    }

    // Real-time password strength checking
    if (field === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    setFormState(prev => ({
      ...prev,
      [field]: e.target.checked,
      errors: { ...prev.errors, terms: null }
    }));
  };

  const togglePasswordVisibility = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const contactFields = [
    {
      label: 'First Name',
      field: 'firstname',
      placeholder: 'Enter your first name',
      type: 'text',
      icon: <UserRound size={16} className="mr-2" />,
      required: true,
    },
    {
      label: 'Last Name',
      field: 'lastname',
      placeholder: 'Enter your last name',
      type: 'text',
      icon: <UserRound size={16} className="mr-2" />,
      required: true,
    },
    {
      label: 'Username',
      field: 'username',
      placeholder: 'Choose a unique username',
      type: 'text',
      icon: <UserRound size={16} className="mr-2" />,
      required: true,
      extraNote: 'Must be at least 3 characters long',
    },
    {
      label: 'Email Address',
      field: 'email',
      placeholder: 'Enter your email address',
      type: 'email',
      icon: <Mail size={16} className="mr-2" />,
      required: true,
      extraNote: 'We\'ll send a verification email to this address',
    },
    {
      label: 'Phone Number',
      field: 'phone',
      placeholder: 'Enter your phone number',
      type: 'tel',
      icon: <Phone size={16} className="mr-2" />,
      required: true,
    },
    {
      label: 'Password',
      field: 'password',
      placeholder: 'Create a strong password',
      type: 'password',
      icon: <Lock size={16} className="mr-2" />,
      required: true,
      showToggle: true,
    },
    {
      label: 'Confirm Password',
      field: 'confirmPassword',
      placeholder: 'Confirm your password',
      type: 'password',
      icon: <Lock size={16} className="mr-2" />,
      required: true,
      showToggle: true,
    },
  ];

  const allRequiredFilled = contactFields
    .filter((f) => f.required)
    .every((f) => formData[f.field] && formData[f.field].trim().length > 0) &&
    formState.termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      toast.error('Please fix the errors in the form');
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: Number(formData.phone),
        password: formData.password,
        passwordConfirm: formData.password,
        role: "Merchant",
        emailVisibility: true, // Set email visibility to true as requested
        status: "Pending" // Set initial status as pending until email verification
      };

      // Create user account
      const user = await pb.collection('users').create(userData);

      if (user) {
        // Store user ID for the next steps
        localStorage.setItem('userId', JSON.stringify(user.id));
        localStorage.setItem('userEmail', JSON.stringify(user.email));

        // Request email verification
        await pb.collection('users').requestVerification(user.email);

        toast.success('Account created! Please check your email for verification.');

        // Redirect to email verification page
        router.push('/client/register/verify-email');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific PocketBase errors
      if (error.data?.data) {
        const errorData = error.data.data;
        const newErrors = {};

        if (errorData.email) newErrors.email = 'Email already exists';
        if (errorData.username) newErrors.username = 'Username already taken';

        setFormState(prev => ({ ...prev, errors: newErrors }));
        toast.error('Registration failed. Please check the form.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="w-full min-h-auto flex bg-primary">
      {/* Left Panel */}
      <div className="bg-primary w-1/2  flex flex-col items-center  px-10">
        <img
          src="/Register.png"
          className="h-70 w-70 rounded-2xl shadow-black shadow-lg mb-8 mt-40"
        />
        <h1 className="text-white font-bold text-3xl mb-4 text-center ">
          Welcome to Logistics
        </h1>
        <p className="text-white text-center text-lg mb-8 max-w-md">
          Streamline your logistics operations with our comprehensive management
          platform. Join thousands of businesses optimizing their supply chain.
        </p>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="flex flex-row items-center">
            <Truck className="text-white h-7 w-7 mr-1" />
            <span className="text-white text-sm">Fast Delivery</span>
          </div>
          <div className="flex flex-row items-center">
            <ShieldHalf className="text-white h-7 w-7 mr-1" />
            <span className="text-white text-sm">Secure</span>
          </div>
          <div className="flex flex-row items-center">
            <ChartSpline className="text-white h-7 w-7 mr-1" />
            <span className="text-white text-sm">Analytics</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col w-1/2 min-h-screen items-center justify-center bg-[#F9FAFB] px-8">
        <div className="flex flex-col items-center w-full max-w-md">


          <div className="flex justify-between w-full mb-3 mt-5">
            <h1 className="text-black">Step 1 of 4</h1>
            <a
              href="/client/login"
              className="text-blue-600 ml-1 font-medium hover:underline"
            >
              Login
            </a>
            {/* <h1 className="text-[#6B7280]">Login</h1> */}
          </div>
          <Progress value={25} className="bg-[#E5E7EB]" />

          <div className="flex justify-center gap-10 lg:gap-18">
            {progress.map((prog, idx) => (
              <div key={idx} className="flex flex-col items-center mt-2">
                <div className={`w-10 h-10 text-center flex items-center justify-center font-semibold rounded-full ${idx === 0 ? 'bg-primary text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>
                  {prog.n}
                </div>
                <div className={`mt-1 text-sm ${idx === 0 ? 'text-[#4B5563]' : 'text-primary'}`}>{prog.h}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-5 ">
            <Package className="text-white bg-primary p-2 h-10 w-10 rounded-lg mr-3" />
            <span className="text-2xl font-extrabold text-[#1A2E22] ">
              Logistics
            </span>
          </div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-center mb-2 text-[#1A2E22] mt-5">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Join our logistics platform and start optimizing your operations
          </p>

          {/* Input Fields */}
          {contactFields.map(
            ({ label, field, placeholder, type, icon, required, extraNote, showToggle }) => (
              <div key={field} className="w-full mb-4">
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  {icon}
                  {label}
                  {required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showToggle ?
                      (field === 'password' ? (formState.showPassword ? 'text' : 'password') :
                       field === 'confirmPassword' ? (formState.showConfirmPassword ? 'text' : 'password') : type)
                      : type}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange(field)}
                    placeholder={placeholder}
                    required={required}
                    className={`border w-full h-12 rounded-lg px-3 pr-10 bg-white focus:outline-none focus:ring-2 transition-colors ${
                      formState.errors[field]
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                    }`}
                  />
                  {showToggle && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(
                        field === 'password' ? 'showPassword' : 'showConfirmPassword'
                      )}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {(field === 'password' ? formState.showPassword : formState.showConfirmPassword) ?
                        <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>

                {/* Error message */}
                {formState.errors[field] && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {formState.errors[field]}
                  </div>
                )}

                {/* Password strength indicator */}
                {field === 'password' && formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength.score
                              ? passwordStrength.score <= 2 ? 'bg-red-500' :
                                passwordStrength.score <= 3 ? 'bg-yellow-500' : 'bg-success'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-success'
                    }`}>
                      {passwordStrength.score <= 2 ? 'Weak' :
                       passwordStrength.score <= 3 ? 'Medium' : 'Strong'} password
                    </p>
                    {passwordStrength.feedback.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Extra note */}
                {extraNote && !formState.errors[field] && (
                  <p className="text-xs text-gray-500 mt-1">{extraNote}</p>
                )}
              </div>
            )
          )}

          {/* Terms */}
          <div className="w-full mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.termsAccepted}
                onChange={handleCheckboxChange('termsAccepted')}
                className={`h-5 w-5 mt-0.5 border-2 rounded transition-colors ${
                  formState.errors.terms
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to the
                <a className="text-primary ml-1 hover:underline cursor-pointer font-medium">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a className="text-primary hover:underline cursor-pointer font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {formState.errors.terms && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {formState.errors.terms}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!allRequiredFilled || formState.isSubmitting}
            onClick={handleSubmit}
            className={`w-full h-12 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              allRequiredFilled && !formState.isSubmitting
                ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="ml-1">→</span>
              </>
            )}
          </button>

          {/* Sign In */}
          <p className="mt-6 text-center text-gray-700 text-sm">
            Already have an account?
            <a
              href="/client/login"
              className="text-blue-600 ml-1 font-medium hover:underline"
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
          <button className="mb-20 border border-gray-300 h-12 w-full rounded-md flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition">
            <FcGoogle size={22} />
            <span className="text-base font-medium text-gray-700">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}