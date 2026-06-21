import { motion as Motion } from "framer-motion";
import SectionFrame from "./SectionFrame";
import { getIcon } from "./icons";

function LearnCardsSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {section.items.map((item, index) => {
          const Icon = getIcon(item.icon);
          return (
            <Motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, borderColor: "rgba(244,103,23,0.42)" }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="rounded-lg border border-white/10 bg-black/24 p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/15 text-orange-200">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 min-h-[72px] text-sm leading-6 text-white/58">{item.description}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                <Motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                  className="h-full rounded-full bg-[#f46717]"
                />
              </div>
              <p className="mt-2 text-right text-[11px] text-orange-200">{item.progress}%</p>
            </Motion.article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default LearnCardsSection;
