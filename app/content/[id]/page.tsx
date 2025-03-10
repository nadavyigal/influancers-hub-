"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChange } from "@/lib/firebase-auth"
import { getContent, updateContent, deleteContent } from "@/lib/firebase-content"
import { publishToInstagram } from "@/lib/instagram-api"
import { optimizeContent } from "@/lib/openai"
import { triggerContentGeneration, checkExecutionStatus } from "@/lib/make-integration"
import { Timestamp } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Sparkles, Instagram, Trash2, RefreshCw, Download, Share2, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [optimizedDescription, setOptimizedDescription] = useState("")
  const [activeTab, setActiveTab] = useState("preview")
  
  const router = useRouter()
  const contentId = params.id

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      if (authUser) {
        setUser(authUser)
        try {
          const contentData = await getContent(contentId)
          setContent(contentData)
          
          // If the content is in processing status, check the status periodically
          if (contentData.status === "processing") {
            const interval = setInterval(async () => {
              try {
                const updatedContent = await getContent(contentId)
                setContent(updatedContent)
                
                if (updatedContent.status !== "processing") {
                  clearInterval(interval)
                }
              } catch (error) {
                console.error("Error checking content status:", error)
                clearInterval(interval)
              }
            }, 5000) // Check every 5 seconds
            
            return () => clearInterval(interval)
          }
        } catch (error) {
          console.error("Error fetching content:", error)
          toast({
            title: "Error",
            description: "Failed to load content",
            variant: "destructive",
          })
        }
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [contentId, router])

  const handleOptimizeDescription = async () => {
    if (!content) return
    
    try {
      setProcessing(true)
      const optimized = await optimizeContent({
        contentType: content.contentType,
        text: content.description,
        targetAudience: "Instagram users",
        tone: "engaging",
      })
      
      setOptimizedDescription(optimized)
      
      toast({
        title: "Success",
        description: "Description optimized successfully",
      })
    } catch (error) {
      console.error("Error optimizing description:", error)
      toast({
        title: "Error",
        description: "Failed to optimize description",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleUpdateDescription = async () => {
    if (!content || !optimizedDescription) return
    
    try {
      setProcessing(true)
      await updateContent(contentId, {
        description: optimizedDescription,
      })
      
      setContent({
        ...content,
        description: optimizedDescription,
      })
      
      setOptimizedDescription("")
      
      toast({
        title: "Success",
        description: "Description updated successfully",
      })
    } catch (error) {
      console.error("Error updating description:", error)
      toast({
        title: "Error",
        description: "Failed to update description",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handlePublishToInstagram = async () => {
    if (!content) return
    
    try {
      setProcessing(true)
      
      // In a real implementation, you would get the user's Instagram credentials
      // and call the Instagram API to publish the content
      const mockCredentials = {
        accessToken: "mock_access_token",
        userId: "mock_user_id",
      }
      
      const postId = await publishToInstagram(
        mockCredentials,
        content.mediaUrls[0],
        content.description,
        content.contentType === "video" || content.contentType === "reel"
      )
      
      await updateContent(contentId, {
        status: "published",
        instagramPostId: postId,
        publishedAt: Timestamp.now(),
      })
      
      setContent({
        ...content,
        status: "published",
        instagramPostId: postId,
        publishedAt: Timestamp.now(),
      })
      
      toast({
        title: "Success",
        description: "Content published to Instagram",
      })
    } catch (error) {
      console.error("Error publishing to Instagram:", error)
      toast({
        title: "Error",
        description: "Failed to publish to Instagram",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteContent = async () => {
    if (!content) return
    
    try {
      setProcessing(true)
      await deleteContent(contentId)
      
      toast({
        title: "Success",
        description: "Content deleted successfully",
      })
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
      setProcessing(false)
    }
  }

  const handleRegenerateContent = async () => {
    if (!content) return
    
    try {
      setProcessing(true)
      
      // Trigger content generation using MAKE.com
      await triggerContentGeneration({
        userId: content.userId,
        contentId: contentId,
        contentType: content.contentType,
        styleType: content.styleType,
        mediaUrls: content.mediaUrls,
        text: content.description,
        hashtags: content.hashtags,
      })
      
      // Update content status
      await updateContent(contentId, {
        status: "processing",
      })
      
      setContent({
        ...content,
        status: "processing",
      })
      
      toast({
        title: "Success",
        description: "Content regeneration started",
      })
    } catch (error) {
      console.error("Error regenerating content:", error)
      toast({
        title: "Error",
        description: "Failed to regenerate content",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Content Not Found</h1>
        <p>The content you are looking for does not exist or you do not have permission to view it.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const getStatusBadge = () => {
    switch (content.status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "processing":
        return <Badge variant="secondary" className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Processing</Badge>
      case "completed":
        return <Badge variant="default" className="flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>
      case "published":
        return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center"><Instagram className="h-3 w-3 mr-1" /> Published</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">
              Created: {new Date(content.createdAt.seconds * 1000).toLocaleDateString()}
            </span>
            {content.publishedAt && (
              <span className="text-sm text-gray-500">
                Published: {new Date(content.publishedAt.seconds * 1000).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={processing}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteContent}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerateContent}
            disabled={processing || content.status === "processing"}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
          
          {content.status === "completed" && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handlePublishToInstagram}
              disabled={processing}
            >
              <Instagram className="h-4 w-4 mr-1" />
              Publish to Instagram
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          {content.aiInsights && <TabsTrigger value="insights">AI Insights</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {content.status === "processing" ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <h3 className="text-lg font-medium">Processing Your Content</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    We're creating your {content.contentType} with {content.styleType} style.
                    This may take a few minutes.
                  </p>
                </div>
              ) : content.mediaUrls && content.mediaUrls.length > 0 ? (
                <div className="flex flex-col items-center">
                  {content.contentType === "video" || content.contentType === "reel" ? (
                    <video 
                      src={content.mediaUrls[0]} 
                      controls 
                      className="max-h-[500px] rounded-lg"
                    />
                  ) : (
                    <img 
                      src={content.mediaUrls[0]} 
                      alt={content.title} 
                      className="max-h-[500px] rounded-lg"
                    />
                  )}
                  
                  <div className="w-full mt-6">
                    <h3 className="font-medium mb-2">Caption:</h3>
                    <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                      {content.description}
                      
                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {content.hashtags.map((tag: string, index: number) => (
                            <span 
                              key={index} 
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No Media Available</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    There is no media content available for preview.
                  </p>
                </div>
              )}
            </CardContent>
            {content.status === "completed" && (
              <CardFooter className="flex justify-center space-x-2 pt-0">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p>{content.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="whitespace-pre-wrap">{content.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Content Type</h3>
                <p>{content.contentType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Style Type</h3>
                <p>{content.styleType}</p>
              </div>
              {content.hashtags && content.hashtags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hashtags</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {content.hashtags.map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {content.instagramPostId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Instagram Post ID</h3>
                  <p>{content.instagramPostId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimize" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimize Content</CardTitle>
              <CardDescription>Use AI to enhance your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Original Description:</h3>
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {content.description}
                </div>
              </div>
              
              <Button 
                onClick={handleOptimizeDescription}
                disabled={processing}
                className="w-full"
              >
                {processing ? (
                  "Optimizing..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimize Description with AI
                  </>
                )}
              </Button>
              
              {optimizedDescription && (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Optimized Description:</h3>
                    <Textarea 
                      value={optimizedDescription} 
                      onChange={(e) => setOptimizedDescription(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUpdateDescription}
                    disabled={processing}
                    className="w-full"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Description
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {content.aiInsights && (
          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>AI-generated insights about your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {content.aiInsights}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 