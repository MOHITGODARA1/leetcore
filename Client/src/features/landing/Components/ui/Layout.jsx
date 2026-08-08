import { forwardRef } from "react";

export const Container = forwardRef(
  ({ children, size = "xl", padding = "md", className = "", as, ...props }, ref) => {
    const Component = as || "div";
    const sizes = {
      sm: "max-w-[640px]",
      md: "max-w-[768px]",
      lg: "max-w-[1024px]",
      xl: "max-w-[1200px]",
      "2xl": "max-w-[1360px]",
      full: "max-w-full",
    };

    const paddings = {
      none: "",
      sm: "px-4",
      md: "px-6",
      lg: "px-8",
      xl: "px-10",
    };

    return (
      <Component
        ref={ref}
        className={`mx-auto w-full ${sizes[size] ?? sizes.xl} ${paddings[padding] ?? paddings.md} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = "Container";

export const Section = forwardRef(
  ({ children, variant = "default", padding = "lg", className = "", id, "aria-labelledby": ariaLabelledby, ...props }, ref) => {
    const variants = {
      default: "bg-transparent",
      muted: "bg-[var(--color-bg-elevated)]",
      bordered: "border-y border-[var(--color-border)] bg-transparent",
      elevated: "bg-[var(--color-bg-panel)]",
    };

    const paddings = {
      none: "",
      sm: "py-12",
      md: "py-16",
      lg: "py-20",
      xl: "py-28",
      "2xl": "py-32",
    };

    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={ariaLabelledby}
        className={`w-full ${variants[variant] ?? variants.default} ${paddings[padding] ?? paddings.lg} ${className}`}
        {...props}
      >
        <Container>{children}</Container>
      </section>
    );
  }
);
Section.displayName = "Section";

export const Grid = forwardRef(
  ({ children, cols = 1, gap = "md", className = "", ...props }, ref) => {
    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
      6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
      12: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    const gaps = {
      none: "gap-0",
      sm: "gap-3",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    };

    return (
      <div
        ref={ref}
        className={`grid ${colClasses[cols] ?? colClasses[1]} ${gaps[gap] ?? gaps.md} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

export const Flex = forwardRef(
  (
    { children, direction = "row", align = "center", justify = "start", gap = "md", wrap = false, className = "", as, ...props },
    ref
  ) => {
    const Component = as || "div";
    const directions = {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    };
    const aligns = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };
    const justifies = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };
    const gaps = {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <Component
        ref={ref}
        className={`flex ${directions[direction] ?? directions.row} ${aligns[align] ?? aligns.center} ${justifies[justify] ?? justifies.start} ${gaps[gap] ?? gaps.md} ${wrap ? "flex-wrap" : ""} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Flex.displayName = "Flex";

export default { Container, Section, Grid, Flex };