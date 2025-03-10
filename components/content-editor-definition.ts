import { Agent } from "@/lib/agency-swarm";
import { RunwayMLTool, CanvaAITool, AdobeSenseiTool } from "@/components/tools/content-editing-tools";

// Content Editor Agent definition
export const content_editor = new Agent({
  name: "Content Editor",
  description: "A professional digital marketing expert skilled in AI-driven video and image editing. Focuses on enhancing content quality to boost engagement and audience growth.",
  instructions: `
    1. Process and enhance visual content for maximum engagement.
    2. Auto-edit reels and TikTok videos for optimal performance.
    3. Generate high-performing thumbnails optimized for better click-through rates.
    4. Apply professional-grade enhancements to improve content quality.
    5. Adapt content to different platforms and aspect ratios as needed.
  `,
  tools: [RunwayMLTool, CanvaAITool, AdobeSenseiTool],
  temperature: 0.5,
  max_prompt_tokens: 2000
}); 