import { motion as Motion } from "framer-motion";
import SectionFrame from "./SectionFrame";
import { getIcon } from "./icons";

function WhyLearnSection({ section }) {
  const items = section.items || [];
  const isPlainStringArray = items.length > 0 && typeof items[0] === "string";

  return (
    <SectionFrame section={section}>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const title = isPlainStringArray ? item : (item.title || item.name || "");
          const description = isPlainStringArray ? "" : (item.description || item.why || "");
          const iconName = isPlainStringArray ? "CheckCircle2" : (item.icon || "Code2");
          const Icon = getIcon(iconName);

          return (
            <Motion.article
              key={`${title}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-4 transition cursor-default "
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-300/20 bg-orange-500/14 text-orange-200">
                  <Icon size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate sm:whitespace-normal">{title}</h3>
                  {description && <p className="mt-2 text-sm leading-6 text-white/58">{description}</p>}
                </div>
              </div>
            </Motion.article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default WhyLearnSection;
