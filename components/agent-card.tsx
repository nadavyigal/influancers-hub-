"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconType } from 'react-icons';

interface AgentCardProps {
  name: string;
  description: string;
  subject: string;
  icon: React.ReactNode;
  usageCount?: number;
  onClick?: () => void;
}

export function AgentCard({ name, description, subject, icon, usageCount, onClick }: AgentCardProps) {
  return (
    <Card className="w-full h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-xs">{subject}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        {usageCount !== undefined && (
          <p className="text-xs text-gray-500">{usageCount} uses</p>
        )}
        <Button variant="outline" size="sm" onClick={onClick} className="ml-auto">
          Select
        </Button>
      </CardFooter>
    </Card>
  );
} 