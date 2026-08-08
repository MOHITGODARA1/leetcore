import { forwardRef } from "react";

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

const variants = {
  default: "bg-[var(--color-bg-panel)]",
  elevated: "bg-[var(--color-bg-panel)] shadow-[var(--shadow-lg)]",
  soft: "bg-[var(--color-bg-panel-hover)]",
  transparent: "bg-transparent",
};

const borders = {
  true: "border border-[var(--color-border)]",
  false: "",
  strong: "border border-[var(--color-border-strong)]",
};

/**
 * Card — double-bezel capable, theme-aware, framer-free.
 */
export const Card = forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hover = false,
      bordered = true,
      className = "",
      as,
      ...props
    },
    ref
  ) => {
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={`
          relative
          ${variant in variants ? variants[variant] : variants.default}
          ${borders[bordered] ?? borders.true}
          ${paddings[padding] ?? paddings.md}
          ${
            hover
              ? "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--color-border-strong)]"
              : ""
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={`mb-5 ${className}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef(
  ({ children, className = "", as, ...props }, ref) => {
    const Tag = as || "h3";
    return (
      <Tag

        ref={ref}
        className={`font-display text-lg font-semibold tracking-tight text-[var(--color-text)] ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <p
      ref={ref}
      className={`mt-2 text-[13px] leading-relaxed text-[var(--color-text-muted)] ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export default Card;