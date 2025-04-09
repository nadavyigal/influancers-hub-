"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmail, signInWithGoogle, signUpWithEmail, resetPassword } from "@/lib/firebase-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import type { Auth } from "firebase/auth"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [resetPasswordEmail, setResetPasswordEmail] = useState("")
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { bypassAuth } = useAuth()

  useEffect(() => {
    // Check if Firebase auth is initialized
    const checkFirebase = () => {
      const authInstance = auth;
      if (authInstance) {
        console.log("Firebase auth is available on login page");
        setFirebaseInitialized(true);
        
        // If user is already authenticated, redirect to dashboard
        const currentUser = authInstance.currentUser;
        if (currentUser) {
          console.log("User is already authenticated, redirecting to dashboard");
          void router.push("/dashboard");
        }
      } else {
        console.warn("Firebase auth is not available yet on login page");
        // Check for Firebase config
        console.log("Checking Firebase config:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "API Key exists" : "API Key missing");
        
        // Retry after a short delay
        setTimeout(checkFirebase, 1000);
      }
    };

    checkFirebase();
  }, [router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firebaseInitialized) {
      console.log("Firebase not initialized, checking auth object:", !!auth);
      setErrorMessage("Authentication system is not ready yet. Please try again in a moment.");
      toast({
        title: "Error",
        description: "Authentication system is not ready yet. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true)
    setErrorMessage("")
    
    try {
      console.log("Attempting to sign in with email:", email);
      const result = await signInWithEmail(email, password, rememberMe)
      console.log("Sign in successful", result);
      
      if (!result) {
        throw new Error("Sign in failed - no user data returned");
      }
      
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      })
      void router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Extract the error message and code
      let errorMsg = "An error occurred during sign in";
      if (error.code) {
        // Handle specific Firebase error codes
        switch (error.code) {
          case 'auth/invalid-email':
            errorMsg = "Invalid email address format.";
            break;
          case 'auth/user-disabled':
            errorMsg = "This account has been disabled.";
            break;
          case 'auth/user-not-found':
            errorMsg = "No account found with this email.";
            break;
          case 'auth/wrong-password':
            errorMsg = "Incorrect password.";
            break;
          case 'auth/too-many-requests':
            errorMsg = "Too many failed attempts. Please try again later.";
            break;
          case 'auth/network-request-failed':
            errorMsg = "Network error. Please check your internet connection.";
            break;
          default:
            errorMsg = error.message ? error.message.replace(/^(Firebase:|Error:)\s*/i, "") : "Unknown error occurred";
        }
      }
      
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")
    
    // Validate password
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Attempting to sign up with email:", email);
      await signUpWithEmail(email, password)
      console.log("Sign up successful");
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please verify your email.",
      })
      void router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Extract the error message
      let errorMsg = "An error occurred during sign up";
      if (error.message) {
        // Get the specific error message, remove the "Firebase: " prefix if it exists
        errorMsg = error.message.replace(/^(Firebase:|Error:)\s*/i, "");
      }
      
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMessage("")
    
    try {
      console.log("Attempting to sign in with Google");
      await signInWithGoogle()
      console.log("Google sign in successful");
      toast({
        title: "Success",
        description: "You have successfully signed in with Google.",
      })
      void router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign in error:", error);
      
      // Handle Google sign-in errors differently as they might be user cancellation
      let errorMsg = "An error occurred during Google sign in";
      
      // If the user canceled the login, show a different message
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        errorMsg = "Sign in was canceled. Please try again.";
      } else if (error.message) {
        // Get the specific error message, remove the "Firebase: " prefix if it exists
        errorMsg = error.message.replace(/^(Firebase:|Error:)\s*/i, "");
      }
      
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(resetPasswordEmail);
      setResetPasswordSuccess(true);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      });
    } catch (error: any) {
      // Extract the error message
      let errorMsg = "Failed to send reset email";
      if (error.message) {
        // Get the specific error message, remove the "Firebase: " prefix if it exists
        errorMsg = error.message.replace(/^(Firebase:|Error:)\s*/i, "");
      }
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    try {
      console.log("Using bypass auth for development testing");
      const mockAuth = bypassAuth();
      console.log("Mock auth created:", mockAuth);
      toast({
        title: "Test Login",
        description: "Successfully logged in with test account.",
      });
      void router.push("/dashboard");
    } catch (error) {
      console.error("Test login error:", error);
      toast({
        title: "Error",
        description: "Failed to use test login.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Influencer's Hub</CardTitle>
          <CardDescription>Sign in or create an account to get started</CardDescription>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <Button 
                variant="default" 
                className="w-full mt-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={handleTestLogin}
                disabled={loading}
              >
                Developer Quick Login
              </Button>
              <p className="text-xs text-center mt-1 text-yellow-700">
                Development mode only - bypasses Firebase auth
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
          
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                  </div>
                </div>
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                <div className="mt-2 text-center">
                  <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-xs p-0 h-auto">
                        Forgot your password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      {resetPasswordSuccess ? (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                          Password reset email sent. Please check your inbox and follow the instructions.
                        </div>
                      ) : (
                        <form onSubmit={handlePasswordReset}>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label htmlFor="reset-email">Email</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                value={resetPasswordEmail}
                                onChange={(e) => setResetPasswordEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button type="submit" disabled={loading}>
                              {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            {loading ? "Processing..." : "Sign in with Google"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

