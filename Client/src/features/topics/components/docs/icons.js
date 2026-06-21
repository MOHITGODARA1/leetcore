import {
  ArrowUpRight,
  Boxes,
  Brain,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Gauge,
  Layers3,
  Play,
  Sparkles,
  Trophy,
  Workflow,
} from "lucide-react";

const iconMap = {
  ArrowUpRight,
  Boxes,
  Brain,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Gauge,
  Layers3,
  Play,
  Sparkles,
  Trophy,
  Workflow,
};

export function getIcon(name) {
  return iconMap[name] || Layers3;
}
