"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  uploadFile,
  getUploadedFiles,
  deleteUploadedFile,
  updateFileMetadata,
  type UploadedFile,
} from "@/lib/firebase-storage"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trash2, Upload, FileImage, FileVideo } from "lucide-react"

export function MediaManager() {
  const { user } = useAuth()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      fetchFiles()
    }
  }, [user])

  const fetchFiles = async () => {
    if (user) {
      const uploadedFiles = await getUploadedFiles(user.uid)
      setFiles(uploadedFiles)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (user && selectedFile) {
      setUploading(true)
      try {
        await uploadFile(user.uid, selectedFile)
        await fetchFiles()
        setSelectedFile(null)
        toast({
          title: "File uploaded",
          description: "Your file has been successfully uploaded.",
        })
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDelete = async (fileId: string) => {
    if (user) {
      try {
        await deleteUploadedFile(fileId, user.uid)
        await fetchFiles()
        toast({
          title: "File deleted",
          description: "Your file has been successfully deleted.",
        })
      } catch (error) {
        console.error("Error deleting file:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting your file. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateMetadata = async (fileId: string, metadata: Record<string, any>) => {
    if (user) {
      try {
        await updateFileMetadata(fileId, user.uid, metadata)
        await fetchFiles()
        toast({
          title: "Metadata updated",
          description: "Your file's metadata has been successfully updated.",
        })
      } catch (error) {
        console.error("Error updating metadata:", error)
        toast({
          title: "Update failed",
          description: "There was an error updating your file's metadata. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>Upload images and videos to enhance your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-accent"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {selectedFile ? (
                  <>
                    {selectedFile.type.startsWith("image") ? (
                      <FileImage className="w-8 h-8 mb-4 text-muted-foreground" />
                    ) : (
                      <FileVideo className="w-8 h-8 mb-4 text-muted-foreground" />
                    )}
                    <p className="mb-2 text-sm text-muted-foreground">
                      {selectedFile.name} - {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG, GIF or MP4 (MAX. 20MB)</p>
                  </>
                )}
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Media Files</CardTitle>
          <CardDescription>Manage your uploaded media files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-semibold">{file.fileName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(file.uploadDate).toLocaleString()} - {Math.round(file.fileSize / 1024)} KB
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateMetadata(file.id, { description: "Updated description" })}
                  >
                    Update Metadata
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(file.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

