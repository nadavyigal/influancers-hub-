// Mock implementation of agency-swarm
// This file provides mock classes and functions to prevent build errors

export class Agent {
  name: string;
  description: string;

  constructor(config: any) {
    this.name = config.name || "Mock Agent";
    this.description = config.description || "Mock Agent Description";
  }

  async run(message: string): Promise<string> {
    return `Mock response for: ${message}`;
  }
}

export class Team {
  name: string;
  description: string;
  agents: Agent[];

  constructor(config: any) {
    this.name = config.name || "Mock Team";
    this.description = config.description || "Mock Team Description";
    this.agents = config.agents || [];
  }

  async run(message: string): Promise<string> {
    return `Mock team response for: ${message}`;
  }
}

export class Agency {
  apiKey: string;
  teams: Team[];

  constructor(config: any) {
    this.apiKey = config.apiKey || "";
    this.teams = [];
  }

  addTeam(team: Team): void {
    this.teams.push(team);
  }

  async run(message: string): Promise<string> {
    return `Mock agency response for: ${message}`;
  }
} 