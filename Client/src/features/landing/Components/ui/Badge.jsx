import { forwardRef } from "react";

const variants = {
  default:
    "bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  accent:
    "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/30",
  success:
    "bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/30",
  warning:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]/30",
  error:
    "bg-[var(--color-error-soft)] text-[var(--color-error)] border border-[var(--color-error)]/30",
  outline:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)]",
};

const sizes = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3 py-1.5 text-xs",
  lg: "px-3.5 py-1.5 text-[13px]",
};

export const Badge = forwardRef(
  ({ children, variant = "default", size = "md", dot = false, className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      )}
      <span>{children}</span>
    </span>
  )
);

Badge.displayName = "Badge";

export const Icon = forwardRef(
  ({ children, size = "md", className = "", label, ...props }, ref) => {
    const sizes = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    };
    return (
      <span
        ref={ref}
        className={`inline-flex shrink-0 items-center justify-center ${sizes[size] || sizes.md} ${className}`}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={!label}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Icon.displayName = "Icon";

export const Avatar = forwardRef(
  (
    { src, alt = "", name, size = "md", shape = "circle", className = "", ...props },
    ref
  ) => {
    const sizes = {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };
    const shapes = {
      circle: "rounded-full",
      square: "rounded-xl",
      rounded: "rounded-lg",
    };
    const getInitials = (n) =>
      n
        ? n
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    if (src) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt || name || "Avatar"}
          className={`${sizes[size]} ${shapes[shape]} border border-[var(--color-border)] object-cover ${className}`}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={`${sizes[size]} ${shapes[shape]} flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-accent-soft)] font-semibold text-[var(--color-accent)] ${className}`}
        aria-label={name || "User avatar"}
        {...props}
      >
        {name ? getInitials(name) : "?"}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default { Badge, Icon, Avatar };