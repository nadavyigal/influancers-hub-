"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Music2,
  Linkedin, 
  Save,
  Trash2,
  AlertCircle,
  Upload
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteUserAccount } from "@/lib/firebase-auth"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    instagramHandle: "",
    youtubeHandle: "",
    twitterHandle: "",
    tiktokHandle: "",
    linkedinHandle: "",
    photoURL: ""
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  
  const { toast } = useToast()
  const router = useRouter()
  
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        bio: userProfile.bio || "",
        instagramHandle: userProfile.instagramHandle || "",
        youtubeHandle: userProfile.youtubeHandle || "",
        twitterHandle: userProfile.twitterHandle || "",
        tiktokHandle: userProfile.tiktokHandle || "",
        linkedinHandle: userProfile.linkedinHandle || "",
        photoURL: userProfile.photoURL || ""
      })
    }
  }, [userProfile])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  
  const handleSaveProfile = async () => {
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")
    
    try {
      if (user) {
        await updateUserProfile(formData)
        setSuccessMessage("Profile updated successfully")
        toast({
          title: "Success",
          description: "Your profile has been updated successfully."
        })
      }
    } catch (error: any) {
      setErrorMessage(`Failed to update profile: ${error.message}`)
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    
    try {
      if (user) {
        await deleteUserAccount(user.uid)
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted."
        })
        router.push("/login")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete account: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage src={formData.photoURL || "/placeholder.svg?height=96&width=96"} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {formData.displayName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Social Media Profiles</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                      Instagram
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
                      YouTube
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
                      Twitter
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
                      TikTok
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
                      LinkedIn
                    </Label>
                    <Input
                      name="linkedinHandle"
                      value={formData.linkedinHandle}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center">
                  <Input value={user?.email || ""} disabled className="bg-muted" />
                  <Button variant="outline" className="ml-2" disabled>
                    Change
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Email address changes are currently disabled
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4 text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>All your data will be permanently deleted. This action cannot be reversed.</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
                        <Input
                          id="confirm-delete"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                        {loading ? "Deleting..." : "Delete Account"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 