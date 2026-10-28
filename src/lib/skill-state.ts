import type { Skill } from "@/lib/api"

export type SkillState = "active" | "manual" | "disabled"

export function skillState(skill: Skill): SkillState {
  if (!skill.enabled) return "disabled"
  if (skill.manualOnly) return "manual"
  return "active"
}
