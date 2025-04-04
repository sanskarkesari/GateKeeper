import { Button } from "@/components/ui/button";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, adminSession } = useAuth();
  const { toast } = useToast();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Get the intended destination from location state
    const from = location.state?.from?.pathname || "/";
    const requireAdmin = location.state?.requireAdmin || false;

    // If already logged in, redirect to appropriate dashboard
    if (adminSession) {
      navigate("/admin", { replace: true });
      return;
    }
    
    if (session && !requireAdmin) {
      navigate(from, { replace: true });
      return;
    }

    // If admin login is required, show admin login form
    if (requireAdmin) {
      setIsAdminLogin(true);
    }
  }, [session, adminSession, navigate, location]);

  const handleAdminLogin = async () => {
    setLoginError("");
    
    // Validate inputs
    const username = adminUsername?.trim();
    const password = adminPassword?.trim();
    
    if (!username || !password) {
      setLoginError("Username and password are required");
      return;
    }
  
    setIsLoading(true);
    
    try {
      // Use adminSupabase client for admin operations
      const { data: admin, error: queryError } = await adminSupabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();
  
      if (queryError) {
        throw new Error(`Query error: ${queryError.message}`);
      }
  
      if (!admin) {
        // Check if username exists but password is wrong
        const { data: usernameCheck } = await adminSupabase
          .from('admin_users')
          .select('username')
          .eq('username', username)
          .maybeSingle();
  
        throw new Error(usernameCheck 
          ? "Incorrect password" 
          : "Admin username not found");
      }
  
      // Update last login
      await adminSupabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);
  
      // Set session in localStorage and update context
      const adminSessionData = {
        id: admin.id,
        username: admin.username,
        role: 'admin' as const
      };
      
      localStorage.setItem('adminSession', JSON.stringify(adminSessionData));
  
      toast({ 
        title: "Login Successful", 
        description: `Welcome ${admin.username}` 
      });

      // Force reload to ensure admin session is picked up
      window.location.href = "/admin";
      
    } catch (error: any) {
      console.error("Login error details:", error);
      setLoginError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to Gatekeeper</CardTitle>
          <CardDescription className="text-center">
            {isAdminLogin ? "Admin Access Only" : "Choose your authentication method below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdminLogin ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Admin Portal</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  This area is restricted to administrators only.
                </p>
                
                {loginError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Admin Login Failed</AlertTitle>
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3 w-full max-w-xs">
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Username
                    </Label>
                    <Input
                      id="adminUsername"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter admin username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword" className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleAdminLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Login as Admin"}
                  </Button>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => {
                  setIsAdminLogin(false);
                  setLoginError("");
                }}>
                  Back to Regular Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SignInForm />
                </TabsContent>
                <TabsContent value="signup">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => setIsAdminLogin(true)}>
                  Admin Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;