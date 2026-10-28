import React, {
  forwardRef,
  useCallback,
  type ReactNode,
  type ButtonHTMLAttributes,
  useRef,
  useImperativeHandle,
} from "react";
import "./Button.css"

/**
 * Button variants — the color theme of the button.
 * e.g. "primary" (brand color), "destructive" (red), "secondary" (muted), etc.
 */
type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive";

/**
 * Button appearance — how the variant is rendered visually.
 *   "fill"     → solid background with the variant color (default)
 *   "outlined" → transparent background; variant color becomes the border + text
 *
 * Examples:
 *   variant="destructive" appearance="fill"      → solid red button, white text
 *   variant="destructive" appearance="outlined"  → transparent button, red border, red text
 *   variant="primary"    appearance="outlined"   → transparent button, primary-color border + text
 */
type ButtonAppearance = "fill" | "outlined";

/**
 * Button sizes
 */
type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  children?: ReactNode;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  iconOnly?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  success?: boolean;
  successText?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

interface ButtonHandle {
  focus: () => void;
  blur: () => void;
  click: () => void;
}

const Button = forwardRef<ButtonHandle, ButtonProps>(
  (
    {
      children,
      variant = "default",
      appearance = "outlined",
      size = "md",
      icon,
      iconRight,
      iconOnly = false,
      loading = false,
      loadingText,
      success = false,
      successText,
      fullWidth = false,
      disabled,
      className,
      type = "button",
      title,
      ...rest
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => buttonRef.current?.focus(),
      blur: () => buttonRef.current?.blur(),
      click: () => buttonRef.current?.click(),
    }));

    const isDisabled = disabled || loading;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        rest.onClick?.(e);
      },
      [isDisabled, rest]
    );

    const actualSize = iconOnly ? "icon" : size;

    // Backward-compat: the old `variant="outline"` is treated as
    // `variant="default" appearance="outlined"` under the new system.
    const actualVariant = variant === "outline" ? "default" : variant;
    const actualAppearance =
      variant === "outline" ? "outlined" : appearance;

    return (
      <button
        ref={buttonRef}
        type={type}
        className={[
          "btn-root",
          `btn-root--${actualVariant}`,
          `btn-root--${actualSize}`,
          `btn-root--${actualAppearance}`,
          iconOnly ? "btn-root--icon-only" : "",
          fullWidth ? "btn-root--full-width" : "",
          loading ? "btn-root--loading" : "",
          success && !loading ? "btn-root--success" : "",
          isDisabled ? "btn-root--disabled" : "",
          className || "",
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        onClick={handleClick}
        {...rest}
      >
        {loading && (
          <span className="btn-loader" aria-hidden="true">
            <span className="btn-loader__spinner" />
          </span>
        )}

        {!loading && success && (
          <span className="btn-success-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}

        {icon && !iconOnly && (
          <span className="btn-icon btn-icon--left">{icon}</span>
        )}

        {iconOnly && icon && <span className="btn-icon btn-icon--only">{icon}</span>}

        {loading && loadingText && (
          <span className="btn-text">{loadingText}</span>
        )}

        {success && !loading && successText && (
          <span className="btn-text">{successText}</span>
        )}

        {!loading && !success && !iconOnly && (children || title) && (
          <span className="btn-text">{children ?? title}</span>
        )}

        {iconRight && !iconOnly && (
          <span className="btn-icon btn-icon--right">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

export type { ButtonProps, ButtonHandle, ButtonVariant, ButtonAppearance, ButtonSize };