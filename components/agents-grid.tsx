"use client";

import React, { useState } from 'react';
import { AgentCard } from './agent-card';
import { 
  FiEdit3, 
  FiSearch, 
  FiBarChart2, 
  FiMessageCircle, 
  FiTrendingUp, 
  FiClipboard, 
  FiCheckSquare, 
  FiUsers, 
  FiDatabase,
  FiCalendar
} from 'react-icons/fi';

// Define the agent data structure
interface Agent {
  id: string;
  name: string;
  subject: string;
  description: string;
  icon: React.ReactNode;
  team: string;
  usageCount?: number;
  canSelectReels?: boolean;
}

// Create a list of agents based on the existing agency-swarm agents
const agents: Agent[] = [
  {
    id: 'content-idea',
    name: 'Idea Generator',
    subject: 'Content Creation',
    description: 'Generates creative and engaging content ideas for influencers based on their niche, audience, and platform.',
    icon: <FiEdit3 className="w-5 h-5" />,
    team: 'content',
    usageCount: 124
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    subject: 'Content Creation',
    description: 'Creates high-quality, engaging content for various platforms based on content briefs and brand guidelines.',
    icon: <FiClipboard className="w-5 h-5" />,
    team: 'content',
    usageCount: 98
  },
  {
    id: 'content-reviewer',
    name: 'Content Reviewer',
    subject: 'Content Creation',
    description: 'Reviews content for quality, brand alignment, and effectiveness before publication.',
    icon: <FiCheckSquare className="w-5 h-5" />,
    team: 'content',
    usageCount: 76
  },
  {
    id: 'content-scheduler',
    name: 'Content Scheduler',
    subject: 'Content Creation',
    description: 'Schedules content for optimal posting times across platforms to maximize audience engagement.',
    icon: <FiCalendar className="w-5 h-5" />,
    team: 'content',
    usageCount: 85,
    canSelectReels: true
  },
  {
    id: 'influencer-research',
    name: 'Influencer Researcher',
    subject: 'Influencer Management',
    description: 'Researches and identifies suitable influencers based on campaign goals, audience demographics, and engagement metrics.',
    icon: <FiSearch className="w-5 h-5" />,
    team: 'influencer',
    usageCount: 112
  },
  {
    id: 'campaign-manager',
    name: 'Campaign Manager',
    subject: 'Influencer Management',
    description: 'Plans and coordinates influencer marketing campaigns, including timelines, deliverables, and performance tracking.',
    icon: <FiUsers className="w-5 h-5" />,
    team: 'influencer',
    usageCount: 89
  },
  {
    id: 'outreach-agent',
    name: 'Outreach Specialist',
    subject: 'Influencer Management',
    description: 'Creates personalized outreach messages and manages communication with influencers.',
    icon: <FiMessageCircle className="w-5 h-5" />,
    team: 'influencer',
    usageCount: 67
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    subject: 'Analytics',
    description: 'Analyzes campaign data to extract meaningful insights and identify trends and patterns.',
    icon: <FiDatabase className="w-5 h-5" />,
    team: 'analytics',
    usageCount: 103
  },
  {
    id: 'reporting-agent',
    name: 'Reporting Specialist',
    subject: 'Analytics',
    description: 'Creates comprehensive reports on campaign performance, ROI, and audience engagement.',
    icon: <FiBarChart2 className="w-5 h-5" />,
    team: 'analytics',
    usageCount: 85
  },
  {
    id: 'insights-agent',
    name: 'Insights Strategist',
    subject: 'Analytics',
    description: 'Provides strategic insights and recommendations based on data analysis and industry trends.',
    icon: <FiTrendingUp className="w-5 h-5" />,
    team: 'analytics',
    usageCount: 72
  }
];

interface AgentsGridProps {
  onSelectAgent?: (agent: Agent) => void;
  selectedTeam?: string;
}

export function AgentsGrid({ onSelectAgent, selectedTeam }: AgentsGridProps) {
  // Filter agents by team if a team is selected
  const filteredAgents = selectedTeam 
    ? agents.filter(agent => agent.team === selectedTeam)
    : agents;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="h-full">
            <AgentCard
              name={agent.name}
              subject={agent.subject}
              description={agent.description}
              icon={agent.icon}
              usageCount={agent.usageCount}
              onClick={() => onSelectAgent && onSelectAgent(agent)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 