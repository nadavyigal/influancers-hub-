// Mock implementation of the agency-swarm library
// This is used to prevent build errors when the actual library is not available

interface AgentOptions {
  apiKey: string;
  name?: string;
  description?: string;
  instructions?: string;
  tools?: any[];
  temperature?: number;
  maxPromptTokens?: number;
}

interface AgencyOptions {
  apiKey: string;
  [key: string]: any;
}

// Export the mockAgencySwarm function needed by monetization-agency.ts
export async function mockAgencySwarm(agency: any, prompt: string): Promise<string> {
  console.log(`Mock Agency Swarm running with prompt: "${prompt.substring(0, 50)}..."`);
  try {
    // Simulate a delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Mock agency swarm response for ${agency.name || 'Unknown Agency'}: ${prompt}`;
  } catch (error) {
    console.error("Error in mockAgencySwarm:", error);
    throw new Error(`Failed to run mockAgencySwarm: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export class Agent {
  name: string;
  description: string;
  instructions: string;
  tools: any[];
  temperature: number;
  maxPromptTokens: number;
  apiKey: string;

  constructor(options: AgentOptions) {
    console.log("Creating mock Agent instance");
    try {
      this.name = options.name || "Mock Agent";
      this.description = options.description || "A mock agent for development";
      this.instructions = options.instructions || "";
      this.tools = options.tools || [];
      this.temperature = options.temperature || 0.7;
      this.maxPromptTokens = options.maxPromptTokens || 2000;
      this.apiKey = options.apiKey || "";
      
      if (!this.apiKey) {
        console.warn("Warning: Agent created without API key");
      }
      
      console.log(`Mock Agent "${this.name}" created successfully`);
    } catch (error) {
      console.error("Error creating mock Agent:", error);
      throw new Error(`Failed to create mock Agent: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async run(prompt: string): Promise<string> {
    console.log(`Mock Agent "${this.name}" running with prompt: "${prompt.substring(0, 50)}..."`);
    try {
      // Simulate a delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Mock response from ${this.name}: ${prompt}`;
    } catch (error) {
      console.error(`Error in mock Agent "${this.name}" run:`, error);
      throw new Error(`Failed to run mock Agent: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export class Team {
  name: string;
  agents: Agent[];

  constructor(name: string, agents: Agent[]) {
    console.log(`Creating mock Team "${name}"`);
    try {
      this.name = name;
      this.agents = agents;
      console.log(`Mock Team "${name}" created successfully with ${agents.length} agents`);
    } catch (error) {
      console.error(`Error creating mock Team "${name}":`, error);
      throw new Error(`Failed to create mock Team: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async run(prompt: string): Promise<string> {
    console.log(`Mock Team "${this.name}" running with prompt: "${prompt.substring(0, 50)}..."`);
    try {
      // Simulate a delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Mock team response from ${this.name}: ${prompt}`;
    } catch (error) {
      console.error(`Error in mock Team "${this.name}" run:`, error);
      throw new Error(`Failed to run mock Team: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export class Agency {
  teams: Team[];
  apiKey: string;

  constructor(options: AgencyOptions) {
    console.log("Creating mock Agency instance");
    try {
      this.teams = [];
      this.apiKey = options.apiKey || "";
      
      if (!this.apiKey) {
        console.warn("Warning: Agency created without API key");
      }
      
      console.log("Mock Agency created successfully");
    } catch (error) {
      console.error("Error creating mock Agency:", error);
      throw new Error(`Failed to create mock Agency: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  addTeam(team: Team): void {
    console.log(`Adding team "${team.name}" to mock Agency`);
    try {
      this.teams.push(team);
      console.log(`Team "${team.name}" added successfully to mock Agency`);
    } catch (error) {
      console.error(`Error adding team "${team.name}" to mock Agency:`, error);
      throw new Error(`Failed to add team to mock Agency: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async run(prompt: string, teamName?: string): Promise<string> {
    console.log(`Mock Agency running with prompt: "${prompt.substring(0, 50)}..."`);
    try {
      // If a team name is provided, run the prompt with that team
      if (teamName) {
        const team = this.teams.find(t => t.name === teamName);
        if (!team) {
          throw new Error(`Team "${teamName}" not found`);
        }
        return await team.run(prompt);
      }
      
      // Otherwise, run the prompt with the first team
      if (this.teams.length === 0) {
        throw new Error("No teams available in the agency");
      }
      
      return await this.teams[0].run(prompt);
    } catch (error) {
      console.error("Error in mock Agency run:", error);
      throw new Error(`Failed to run mock Agency: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
} 