import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useGsapEntrance } from "../hooks";

// 👇 Adjust box size here
const CARD_WIDTH = 380;   // px
const CARD_HEIGHT = 190;  // px

const cards = [
  {
    title: "What's next on Leetcore",
    kicker: "Roadmap",
    to: "/dashboard/what's-next-on-leetcore",
    img: "https://res.cloudinary.com/dznwqaqjw/image/upload/v1784921958/Untitled_design_zz3kwg.png",
  },
  {
    title: "What's new on Leetcore",
    kicker: "Changelog",
    to: "/dashboard/what's-new-on-leetcore",
    img: "https://res.cloudinary.com/dznwqaqjw/image/upload/v1784921322/What_s_New_on_Leetcore_1_lzr62h.png",
  },
  {
    title: "Career opportunities",
    kicker: "Openings",
    to: "/dashboard/Career-oppertunity-on-leetcore",
    img: "https://res.cloudinary.com/dznwqaqjw/image/upload/v1784922863/Untitled_design_1_lygwsx.png",
  },
  {
    title: "Social media footprint",
    kicker: "Community",
    to: "/dashboard/Social-media-footprint",
    img: "https://res.cloudinary.com/dznwqaqjw/image/upload/v1784924874/ChatGPT_Image_Jul_25_2026_01_57_32_AM_qc4qu2.png",
  },
];

function Mainboxes() {
  const sectionRef = useRef(null);

  useGsapEntrance(sectionRef, { y: 14, stagger: 0.06 });

  return (
    <section ref={sectionRef} className="pt-14">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="no-scrollbar flex gap-5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {cards.map((card) => (
          <div
            key={card.to}
            data-reveal
            className="shrink-0 snap-start"
            style={{ width: CARD_WIDTH }}
          >
            <Link
              to={card.to}
              className="group relative block overflow-hidden rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--dash-line-strong)] hover:shadow-[var(--shadow-lg)]"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <img
                src={card.img}
                alt={card.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />

              {/* Bottom label */}
              
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Mainboxes;