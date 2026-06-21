import CommonMistakesSection from "./docs/CommonMistakesSection";
import ComplexitySection from "./docs/ComplexitySection";
import DefinitionSection from "./docs/DefinitionSection";
import HeroSection from "./docs/HeroSection";
import InternalWorkingSection from "./docs/InternalWorkingSection";
import InterviewQuestionsSection from "./docs/InterviewQuestionsSection";
import IntroductionSection from "./docs/IntroductionSection";
import LearnCardsSection from "./docs/LearnCardsSection";
import OperationsSection from "./docs/OperationsSection";
import PracticeRoadmapSection from "./docs/PracticeRoadmapSection";
import RealLifeExampleSection from "./docs/RealLifeExampleSection";
import RecommendedVideosSection from "./docs/RecommendedVideosSection";
import SyntaxSection from "./docs/SyntaxSection";
import VisualizationSection from "./docs/VisualizationSection";
import WhyLearnSection from "./docs/WhyLearnSection";

const sectionComponents = {
  paragraph: IntroductionSection,
  callout: DefinitionSection,
  dual_callout: DefinitionSection,
  example: RealLifeExampleSection,
  comparison: RealLifeExampleSection,
  why_learn: WhyLearnSection,
  list: WhyLearnSection,
  operations: OperationsSection,
  visualization: VisualizationSection,
  internal: InternalWorkingSection,
  array_vector_internal: InternalWorkingSection,
  syntax: SyntaxSection,
  complexity: ComplexitySection,
  comparison_table: ComplexitySection,
  table: ComplexitySection,
  functions: WhyLearnSection,
  videos: RecommendedVideosSection,
  mistakes: CommonMistakesSection,
  roadmap: PracticeRoadmapSection,
  questions: InterviewQuestionsSection,
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-5">
      {[240, 130, 180, 150].map((height) => (
        <div key={height} className="animate-pulse rounded-lg border border-white/8 bg-white/[0.035]" style={{ height }} />
      ))}
    </div>
  );
}

function DocsContent({ doc, loading = false }) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!doc) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-white/10 bg-black/20 p-6">
          <p className="text-sm font-medium text-orange-300">Documentation not found</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Docs for this topic are not available yet.</h1>
          <p className="mt-2 text-sm leading-6 text-white/60">Add this topic to the docs JSON and the page will render automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-7xl space-y-4 px-3 py-4 bg-[#101012]/88 sm:px-5 lg:px-6">
      <HeroSection hero={doc.hero} />
      {doc.sections.map((section) => {
        const Component = sectionComponents[section.type];
        if (!Component) return null;
        return <Component key={section.id} section={section} />;
      })}
    </article>
  );
}

export default DocsContent;
