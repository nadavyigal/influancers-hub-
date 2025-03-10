# Agency Swarm Integration for Influencers Hub

This directory contains the integration of [Agency Swarm](https://github.com/VRSEN/agency-swarm) into the Influencers Hub platform. Agency Swarm is a framework for creating autonomous AI agent teams that can collaborate to solve complex tasks.

## Overview

The Influencers Hub Agency consists of three specialized teams:

1. **Content Creation Team**
   - Content Idea Agent: Generates creative content ideas for influencers
   - Content Writer Agent: Writes high-quality content based on ideas
   - Content Reviewer Agent: Reviews and improves content quality

2. **Influencer Management Team**
   - Influencer Research Agent: Researches and analyzes influencers
   - Campaign Manager Agent: Plans and manages influencer campaigns
   - Outreach Agent: Handles influencer outreach and relationship management

3. **Analytics Team**
   - Data Analyst Agent: Analyzes influencer and campaign data
   - Reporting Agent: Creates comprehensive reports
   - Insights Agent: Provides strategic insights and recommendations

## Usage

The Agency Swarm integration can be accessed through the AI Assistant page in the Influencers Hub platform. Users need to provide their OpenAI API key to initialize the agency.

### Requirements

- OpenAI API key with access to GPT-4 models
- Agency Swarm package (installed via npm)

### How It Works

1. The user initializes the agency with their OpenAI API key
2. The user selects a team based on their needs
3. The user provides a prompt describing their request
4. The selected team collaborates to generate a response
5. The user reviews and implements the suggestions

## Customization

You can customize the agents and teams by modifying the files in this directory:

- `index.ts`: Main configuration file for the agency
- `teams/`: Contains team definitions
- `agents/`: Contains agent definitions

To add new tools or capabilities to agents, modify the respective agent files and add the necessary tools to the `tools` array.

## Learn More

- [Agency Swarm Documentation](https://github.com/VRSEN/agency-swarm)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

## Contributing

If you want to contribute to this integration, please follow these steps:

1. Create a new branch for your feature or fix
2. Make your changes
3. Test your changes thoroughly
4. Submit a pull request with a clear description of your changes 