import { forwardRef } from "react";

const variants = {
  primary: {
    base: "bg-[var(--color-text)] text-[var(--color-text-inverse)] hover:bg-[var(--color-text)]/88",
    pressed: "bg-[var(--color-text)]/90",
  },
  accent: {
    base: "bg-[var(--color-accent)] text-[#09090b] hover:bg-[var(--color-accent-hover)]",
    pressed: "bg-[var(--color-accent-hover)]",
  },
  secondary: {
    base: "bg-[var(--color-bg-panel)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-panel-hover)]",
    pressed: "bg-[var(--color-bg-panel-hover)]",
  },
  ghost: {
    base: "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-panel)]",
    pressed: "bg-[var(--color-bg-panel)]",
  },
  destructive: {
    base: "bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90",
    pressed: "bg-[var(--color-error)]/90",
  },
};

const sizes = {
  sm: "px-4 py-2 text-[13px] gap-2 rounded-lg",
  md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-7 py-3.5 text-[15px] gap-2.5 rounded-xl",
  xl: "px-9 py-4 text-base gap-3 rounded-2xl",
  icon: "p-2.5 rounded-xl",
  "icon-sm": "p-2 rounded-lg",
  "icon-lg": "p-3.5 rounded-xl",
};

const widths = {
  full: "w-full",
  fit: "w-fit",
  auto: "w-auto",
};

/**
 * Button — pure CSS transitions (no Framer Motion). Premium micro-physics:
 * gentle lift on hover, physical press on active, nested trailing icon wrapper.
 */
export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      width = "fit",
      leftIcon,
      rightIcon,
      loading = false,
      disabled = false,
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;
    const widthStyles = widths[width] || widths.fit;
    const isDisabled = loading || disabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={`
          group/btn relative inline-flex items-center justify-center font-semibold
          overflow-hidden select-none
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100
          ${variantStyles.base} ${sizeStyles} ${widthStyles} ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{loading ? "Loading" : children}</span>
        {rightIcon && (
          <span
            className="ml-0.5 flex h-[1.65em] w-[1.65em] shrink-0 items-center justify-center rounded-full bg-[var(--color-border)] text-inherit transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0.5"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;