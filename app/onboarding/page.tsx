"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { updateUserProfile } from "@/lib/firebase-auth"
import { Textarea } from "@/components/ui/textarea"
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Music2,
  Linkedin, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { createDemoNotifications } from "@/lib/demo-data"

const steps = [
  { id: "profile", title: "Basic Profile" },
  { id: "social", title: "Social Media" },
  { id: "interests", title: "Interests" },
  { id: "complete", title: "Complete" }
]

// Predefined arrays for interests and content types to avoid recreating on each render
const INTERESTS = [
  "Fashion", "Beauty", "Fitness", "Travel", "Food", "Technology", 
  "Gaming", "Lifestyle", "Business", "Education", "Health", "Wellness"
]

const CONTENT_TYPES = [
  "Photos", "Videos", "Stories", "Reels", "Live Streams", 
  "Blogs", "Podcasts", "Reviews", "Tutorials"
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    instagramHandle: "",
    youtubeHandle: "",
    twitterHandle: "",
    tiktokHandle: "",
    linkedinHandle: "",
    interests: [] as string[],
    contentTypes: [] as string[]
  })
  
  const router = useRouter()
  const { user, userProfile, updateUserProfile: contextUpdateProfile } = useAuth()
  const { toast } = useToast()
  
  // Memoize the checks to reduce recalculations
  const shouldRedirectToLogin = useMemo(() => !user && !loading, [user, loading])
  const hasCompletedOnboarding = useMemo(() => userProfile?.isOnboardingComplete, [userProfile])
  
  useEffect(() => {
    // Early return pattern to improve readability and possibly performance
    if (shouldRedirectToLogin) {
      void router.push("/login")
      return
    }
    
    if (hasCompletedOnboarding) {
      void router.push("/dashboard")
      return
    }
    
    // Pre-fill form data only if not already filled
    if (userProfile && !formData.displayName && userProfile.displayName) {
      setFormData(prevData => ({
        ...prevData,
        displayName: userProfile.displayName || "",
        instagramHandle: userProfile.instagramHandle || ""
      }))
    }
  }, [shouldRedirectToLogin, hasCompletedOnboarding, userProfile, router, formData.displayName])
  
  // Memoized handlers to prevent recreation on each render
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }, [])
  
  const handleInterestToggle = useCallback((interest: string) => {
    setFormData(prevData => {
      const interests = [...prevData.interests]
      if (interests.includes(interest)) {
        return {
          ...prevData,
          interests: interests.filter(i => i !== interest)
        }
      } else {
        return {
          ...prevData,
          interests: [...interests, interest]
        }
      }
    })
  }, [])
  
  const handleContentTypeToggle = useCallback((type: string) => {
    setFormData(prevData => {
      const contentTypes = [...prevData.contentTypes]
      if (contentTypes.includes(type)) {
        return {
          ...prevData,
          contentTypes: contentTypes.filter(t => t !== type)
        }
      } else {
        return {
          ...prevData,
          contentTypes: [...contentTypes, type]
        }
      }
    })
  }, [])
  
  const nextStep = useCallback(async () => {
    setLoading(true)
    try {
    // Validate current step
    if (currentStep === 0 && !formData.displayName) {
        throw new Error("Please enter your display name")
    }
    
    // If this is the last step before completion, save all data
    if (currentStep === steps.length - 2) {
        if (!user) {
          throw new Error("You must be logged in to complete registration")
        }

        // Update both Firebase and context in parallel
        await Promise.all([
          updateUserProfile(user.uid, {
            ...formData,
            isOnboardingComplete: true,
            lastLoginAt: Date.now()
          }),
          contextUpdateProfile({
            ...formData,
            isOnboardingComplete: true,
            updatedAt: Date.now()
          })
        ])

        // Only create demo notifications after both updates succeed
        try {
          await createDemoNotifications(user.uid)
        } catch (notificationError) {
          console.error("Failed to create demo notifications:", notificationError)
          // Continue anyway since this is not critical
        }
          
        toast({
          title: "Success",
          description: "Your profile has been updated successfully."
        })
      }

      // Move to next step
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    } catch (error: any) {
      console.error("Onboarding error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [currentStep, formData, user, contextUpdateProfile, toast])
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])
  
  const finishOnboarding = useCallback(() => {
    void router.push("/dashboard")
  }, [router])
  
  // Memoize step renderers to prevent recreation on each render
  const BasicProfileStep = useMemo(() => (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="How you want to be known"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself"
                rows={4}
              />
            </div>
          </div>
  ), [formData.displayName, formData.bio, handleInputChange])
      
  const SocialMediaStep = useMemo(() => (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                Instagram Handle
              </Label>
              <Input
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleInputChange}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Youtube className="h-4 w-4 mr-2 text-red-500" />
                YouTube Channel
              </Label>
              <Input
                name="youtubeHandle"
                value={formData.youtubeHandle}
                onChange={handleInputChange}
                placeholder="@yourchannel"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                Twitter Handle
              </Label>
              <Input
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleInputChange}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Music2 className="h-4 w-4 mr-2" />
                TikTok Handle
              </Label>
              <Input
                name="tiktokHandle"
                value={formData.tiktokHandle}
                onChange={handleInputChange}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn Profile
              </Label>
              <Input
                name="linkedinHandle"
                value={formData.linkedinHandle}
                onChange={handleInputChange}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
          </div>
  ), [formData.instagramHandle, formData.youtubeHandle, formData.twitterHandle, formData.tiktokHandle, formData.linkedinHandle, handleInputChange])
  
  const InterestsStep = useMemo(() => (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>What topics are you interested in?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
          {INTERESTS.map(interest => (
                  <Button
                    key={interest}
                    type="button"
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    className="rounded-full"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>What type of content do you create?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
          {CONTENT_TYPES.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.contentTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleContentTypeToggle(type)}
                    className="rounded-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
  ), [formData.interests, formData.contentTypes, handleInterestToggle, handleContentTypeToggle])
      
  const CompleteStep = useMemo(() => (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Onboarding Complete!</h3>
            <p className="text-muted-foreground">
              Thank you for completing your profile. You're all set to start using Influencer's Hub!
            </p>
          </div>
  ), [])
  
  // Render the current step efficiently
  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 0: return BasicProfileStep
      case 1: return SocialMediaStep
      case 2: return InterestsStep
      case 3: return CompleteStep
      default: return null
    }
  }, [currentStep, BasicProfileStep, SocialMediaStep, InterestsStep, CompleteStep])
  
  // Calculate button text based on current step
  const nextButtonText = useMemo(() => {
    if (currentStep === steps.length - 2) {
      return loading ? "Saving..." : "Complete"
    }
    return "Next"
  }, [currentStep, loading])
  
  // Calculate progress percentage
  const progressValue = useMemo(() => 
    (currentStep + 1) / steps.length * 100, 
    [currentStep]
  )
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Influencer's Hub</CardTitle>
          <CardDescription>Let's set up your profile in a few simple steps</CardDescription>
          <Progress value={progressValue} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index === currentStep 
                      ? "text-primary font-medium" 
                      : index < currentStep 
                        ? "text-primary/70" 
                        : "text-muted-foreground"
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      index === currentStep 
                        ? "bg-primary text-primary-foreground" 
                        : index < currentStep 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="hidden sm:block text-xs">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 && currentStep < steps.length - 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={loading}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} disabled={loading}>
              {nextButtonText}
              {currentStep < steps.length - 2 && (
                  <ChevronRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          ) : (
            <Button onClick={finishOnboarding}>
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
} 