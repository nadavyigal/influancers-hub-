"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getInsights, createInsight, updateInsight, deleteInsight } from "@/lib/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Insight {
  id: string
  title: string
  content: string
  createdAt: number
}

export function UserContent() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<Insight[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    if (user) {
      const unsubscribe = getInsights(user.uid, (fetchedInsights) => {
        setInsights(fetchedInsights)
      })
      return () => unsubscribe()
    }
  }, [user])

  const handleCreateInsight = async () => {
    if (user && title && content) {
      try {
        await createInsight({
          userId: user.uid,
          title,
          content,
          createdAt: Date.now(),
        })
        setTitle("")
        setContent("")
        toast({
          title: "Insight created",
          description: "Your insight has been successfully created.",
        })
      } catch (error) {
        console.error("Error creating insight:", error)
        toast({
          title: "Error",
          description: "Failed to create insight. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateInsight = async (id: string, updatedData: Partial<Insight>) => {
    try {
      await updateInsight(id, updatedData)
      toast({
        title: "Insight updated",
        description: "Your insight has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating insight:", error)
      toast({
        title: "Error",
        description: "Failed to update insight. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInsight = async (id: string) => {
    try {
      await deleteInsight(id)
      toast({
        title: "Insight deleted",
        description: "Your insight has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting insight:", error)
      toast({
        title: "Error",
        description: "Failed to delete insight. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Insight</CardTitle>
          <CardDescription>Share your thoughts and ideas with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateInsight}>Create Insight</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.title}</CardTitle>
              <CardDescription>{new Date(insight.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{insight.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleUpdateInsight(insight.id, { content: "Updated content" })}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteInsight(insight.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

