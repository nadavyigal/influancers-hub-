"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { VideoIcon, ImageIcon, Play, InfoIcon, Loader2 } from "lucide-react";

export interface ContentEditorAgentProps {
  apiKey?: string;
}

// Main component implementation
export function ContentEditorAgent({ apiKey }: ContentEditorAgentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
  };

  if (!mounted) {
    return null; // Return null on server-side rendering
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-600">Content Editor</CardTitle>
          <CardDescription>
            Professional AI-powered video and image editing for maximum engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4" />
                Video Editor
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image Editor
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <InfoIcon className="w-4 h-4" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="video">Upload Video</Label>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label>Enhancement Options</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="stabilize" />
                        <Label htmlFor="stabilize">Stabilize Video</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="denoise" />
                        <Label htmlFor="denoise">Reduce Noise</Label>
                      </div>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label>Output Quality</Label>
                      <Select defaultValue="1080p">
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">720p</SelectItem>
                          <SelectItem value="1080p">1080p</SelectItem>
                          <SelectItem value="4k">4K</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handleProcess}
                      disabled={!selectedFile || processing}
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Process Video"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="image">Upload Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label>Enhancement Options</Label>
                      <div className="space-y-4">
                        <div>
                          <Label>Brightness</Label>
                          <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
                        <div>
                          <Label>Contrast</Label>
                          <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
                        <div>
                          <Label>Saturation</Label>
                          <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handleProcess}
                      disabled={!selectedFile || processing}
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Process Image"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">About Content Editor</h3>
                    <p className="text-muted-foreground">
                      The Content Editor is a professional digital marketing expert skilled in AI-driven video and image editing. 
                      It focuses on enhancing content quality to boost engagement and audience growth through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Processing and enhancing visual content for maximum engagement</li>
                      <li>Auto-editing reels and TikTok videos for optimal performance</li>
                      <li>Generating high-performing thumbnails optimized for better click-through rates</li>
                      <li>Applying professional-grade enhancements to improve content quality</li>
                      <li>Adapting content to different platforms and aspect ratios</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Default export for dynamic import
export default ContentEditorAgent; 