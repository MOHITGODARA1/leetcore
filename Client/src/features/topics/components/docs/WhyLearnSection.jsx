import { motion as Motion } from "framer-motion";
import SectionFrame from "./SectionFrame";
import { getIcon } from "./icons";
import { renderFormattedText } from "./utils.jsx";

function WhyLearnSection({ section }) {
  const items = section.items || [];
  const isPlainStringArray = items.length > 0 && typeof items[0] === "string";

  return (
    <SectionFrame section={section}>
      <div className="grid gap-3 sm:grid-cols-1 ">
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
              className="rounded-lg   transition cursor-default"
            >
              <div className="flex items-start p-1 gap-3 ">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg  text-green-400">
                  <Icon size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white/80 truncate sm:whitespace-normal">
                    {renderFormattedText(title)}
                  </h3>
                  {description && (
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {renderFormattedText(description)}
                    </p>
                  )}
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
