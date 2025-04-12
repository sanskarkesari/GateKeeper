import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Shield, Users, Home, Bell, Calendar, Lock, Key, MessageSquare, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { AnnouncementsBanner } from "@/components/announcements/AnnouncementsBanner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { session, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [session]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Gatekeeper</span>
          </div>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
                    <Link to="/visitor-management" className="flex gap-2 p-3 hover:bg-muted rounded-md">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Visitor Management</div>
                        <div className="text-sm text-muted-foreground">Control access to your community</div>
                      </div>
                    </Link>
                    <Link to="/maintenance" className="flex gap-2 p-3 hover:bg-muted rounded-md">
                      <Wrench className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Maintenance Requests</div>
                        <div className="text-sm text-muted-foreground">Submit and track maintenance issues</div>
                      </div>
                    </Link>
                    <Link to="/deliveries" className="flex gap-2 p-3 hover:bg-muted rounded-md">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Delivery Management</div>
                        <div className="text-sm text-muted-foreground">Track all your packages</div>
                      </div>
                    </Link>
                    <Link to="/communication" className="flex gap-2 p-3 hover:bg-muted rounded-md">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Community Communication</div>
                        <div className="text-sm text-muted-foreground">Stay connected with residents</div>
                      </div>
                    </Link>
                    <Link to="/facilities" className="flex gap-2 p-3 hover:bg-muted rounded-md">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Facility Bookings</div>
                        <div className="text-sm text-muted-foreground">Reserve community spaces</div>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="text-sm font-medium px-4 py-2 block">
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="text-sm font-medium px-4 py-2 block">
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">My Profile</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/deliveries">Dashboard</Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/admin">Admin Portal</Link>
                  </Button>
                )}
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
                <Button asChild size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 pt-6">
        {session && <AnnouncementsBanner />}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 rounded-xl">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  Revolutionizing <span className="text-primary">Community Living</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 md:max-w-md">
                  Gatekeeper provides a seamless, secure, and user-friendly platform to transform your residential community management.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {session ? (
                    <Button asChild size="lg" className="shadow-lg">
                      <Link to="/deliveries">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="shadow-lg">
                      <Link to="/auth">Get Started</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="lg" asChild className="bg-white">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
                
                <div className="flex gap-8 mt-12">
                  <div>
                    <p className="text-3xl font-bold text-primary">10k+</p>
                    <p className="text-gray-500">Residents</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">100+</p>
                    <p className="text-gray-500">Communities</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">99%</p>
                    <p className="text-gray-500">Satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="Community Management" 
                  className="w-full rounded-xl shadow-xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Comprehensive Community Management</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform brings together all aspects of community living in one centralized solution
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Visitor Management</CardTitle>
                  <CardDescription>Control access to your community with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Pre-authorize guests and visitors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Digital visitor logs and records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Arrival notifications and alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Package className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Delivery Management</CardTitle>
                  <CardDescription>Never miss a package again</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Real-time delivery tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Secure package storage solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Instant delivery notifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Bell className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Communication</CardTitle>
                  <CardDescription>Keep everyone connected and informed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Community announcements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Event notifications and reminders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Emergency alerts and updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Lock className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Enhanced Security</CardTitle>
                  <CardDescription>Peace of mind for all residents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Secure access control systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Digital security logs and records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Incident reporting and management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">How Gatekeeper Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform simplifies community management with a streamlined approach
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-5 text-xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-3">Register Your Community</h3>
                <p className="text-gray-600">Administrators can set up their residential community with customized settings</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-5 text-xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-3">Invite Residents</h3>
                <p className="text-gray-600">Residents receive invitations to join the platform and set up their profiles</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-5 text-xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-3">Manage Everything</h3>
                <p className="text-gray-600">Start managing visitors, deliveries, communication and more in one place</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Trusted by Communities</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See what residents and administrators are saying about Gatekeeper
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-center">
                      <h4 className="font-bold">Ajay Raj</h4>
                      <p className="text-sm text-gray-500">Community Administrator</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"Gatekeeper has transformed how we manage our community. Everything from visitor access to package delivery is now seamless and secure."</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-center">
                      <h4 className="font-bold">Rahul Dua</h4>
                      <p className="text-sm text-gray-500">Resident</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"I never miss a package delivery now, and having the ability to pre-approve visitors has made entertaining so much easier. Highly recommend!"</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="text-center">
                      <h4 className="font-bold">Sneha Sharma</h4>
                      <p className="text-sm text-gray-500">Property Manager</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"As a property manager, Gatekeeper has reduced our administrative workload by 70%. The communication tools alone are worth the investment."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to Transform Your Community?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the hundreds of communities already using Gatekeeper to improve security, convenience, and communication.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="shadow-lg px-8">
                <Link to={session ? "/deliveries" : "/auth"}>
                  {session ? "Go to Dashboard" : "Get Started Today"}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-white shadow-sm">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold">Gatekeeper</span>
                </div>
                <p className="text-gray-600 mb-4">Transforming community living with security, convenience, and connectivity.</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><Link to="/visitor-management">Visitor Management</Link></li>
                  <li><Link to="/deliveries">Delivery Management</Link></li>
                  <li><Link to="/communication">Communication</Link></li>
                  <li><Link to="/security">Security</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/cookies">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t text-center text-gray-500">
              <p>© {new Date().getFullYear()} Gatekeeper. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
