
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Smartphone, Mail, Lock, Shield, Phone } from "lucide-react";

type SignInData = {
  email: string;
  password: string;
  token?: string;
  phone?: string;
};

export const SignInForm = () => {
  const { signIn, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();
  const [showMFA, setShowMFA] = useState(false);
  const [factorId, setFactorId] = useState('');
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<SignInData>();

  const onSubmit = async (data: SignInData) => {
    try {
      // If we have a factorId and token, we're verifying MFA
      if (showMFA && factorId && data.token) {
        const result = await signIn({ 
          email: data.email, 
          password: data.password, 
          token: data.token, 
          factorId: factorId 
        });
        
        if (result.error) {
          toast({
            variant: "destructive",
            title: "MFA Verification Failed",
            description: result.error.message,
          });
        }
      } else if (showPhoneOtp) {
        // Verifying phone OTP
        const result = await verifyOtp(phoneNumber, data.token || '');
        
        if (result.error) {
          toast({
            variant: "destructive",
            title: "Phone Verification Failed",
            description: result.error.message,
          });
        }
      } else {
        // Initial sign in attempt
        const result = await signIn(data);
        
        if (result.error) {
          if (result.error.message.includes("mfa")) {
            // Extract factorId from error message if available
            const factorIdMatch = result.error.message.match(/factor_id=([^&]+)/);
            if (factorIdMatch && factorIdMatch[1]) {
              setFactorId(factorIdMatch[1]);
            }
            
            setShowMFA(true);
            toast({
              title: "MFA Required",
              description: "Please enter your authentication code",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: result.error.message,
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          variant: "destructive",
          title: "Google Sign In Failed",
          description: error.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid phone number",
      });
      return;
    }

    try {
      const { error } = await signInWithPhone(phoneNumber);
      if (error) {
        toast({
          variant: "destructive",
          title: "Phone Sign In Failed",
          description: error.message,
        });
      } else {
        setShowPhoneOtp(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleOTPComplete = (value: string) => {
    setValue('token', value);
    // Auto-submit when OTP is completed
    if (value.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {!showMFA && !showPhoneOtp ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </>
      ) : showMFA ? (
        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Authentication Code
          </Label>
          <div className="flex flex-col items-center">
            <Shield className="h-12 w-12 mb-3 text-primary" />
            <p className="text-center mb-4">Enter the 6-digit code from your authenticator app</p>
            <InputOTP maxLength={6} onChange={handleOTPComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Phone Verification Code
          </Label>
          <div className="flex flex-col items-center">
            <Phone className="h-12 w-12 mb-3 text-primary" />
            <p className="text-center mb-4">Enter the 6-digit code sent to {phoneNumber}</p>
            <InputOTP maxLength={6} onChange={handleOTPComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      )}
      
      {!showMFA && !showPhoneOtp && (
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Sign In"}
        </Button>
      )}
      
      {!showMFA && !showPhoneOtp && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      )}
      
      {!showMFA && !showPhoneOtp && (
        <>
          <Button 
            type="button"
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Sign in with Google
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handlePhoneSignIn}
                variant="outline"
              >
                Send OTP
              </Button>
            </div>
          </div>
        </>
      )}
      
      {(showMFA || showPhoneOtp) && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setShowMFA(false);
            setShowPhoneOtp(false);
          }}
        >
          Back to Sign In
        </Button>
      )}
    </form>
  );
};
