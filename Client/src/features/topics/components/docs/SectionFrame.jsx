import { motion as Motion } from "framer-motion";

function SectionFrame({ section, children, className = "" }) {
  const photo = section?.photo || section?.image || section?.imageUrl;
  const isPhotoTop = section?.photoPosition === "top";
  const skipFramePhoto = section?.type === "internal" || section?.type === "array_vector_internal";

  const renderPhoto = () => {
    if (!photo || skipFramePhoto) return null;
    return (
      <div className={`flex justify-center overflow-hidden rounded-lg border border-white/4 bg-black/20 p-2 max-w-full ${isPhotoTop ? "mb-4" : "mt-4"}`}>
        <img
          src={photo}
          alt={section.title || "Section illustration"}
          className="w-full h-auto rounded-md"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <Motion.section
      id={section.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`scroll-mt-7 rounded-lg bg-[#0f0f11]/86 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-[3px] rounded-full bg-[#f46717]" />
        <h2 className="text-base font-semibold text-white sm:text-lg">{section.title}</h2>
      </div>
      {isPhotoTop && renderPhoto()}
      {children}
      {!isPhotoTop && renderPhoto()}
    </Motion.section>
  );
}

export default SectionFrame;
