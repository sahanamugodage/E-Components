import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'onFocus' | 'onKeyDown'> {
  label?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
  isValid?: boolean;
  width?: string | number;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  className = "",
  label,
  onChange,
  value,
  readOnly = false,
  disabled = false,
  isValid = true,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  width,
  ...rest
}) => {
  const [, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type
  const getInputType = () => {
    if (type === "password" && showPassword) {
      return "text";
    }
    return type;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.value);
    }
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      onFocus?.();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (!disabled && onBlur) {
      onBlur(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled && onKeyDown) {
      onKeyDown(e, String(value));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containerStyle: React.CSSProperties = {
    ...(width ? { width: typeof width === "number" ? `${width}px` : width } : {}),
  };

  return (
    <div
      className={[
        "input-roots",
        "input-group",
        !isValid ? "input-roots--error" : "",
        disabled ? "input-roots--disabled" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={containerStyle}
    >
      {label && <label className="label">{label}</label>}

      <div className="input-wrapper">
        <input
          type={getInputType()}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field"
          readOnly={readOnly || disabled}
          disabled={disabled}
          {...rest}
        />

        {type === "password" && !disabled && !readOnly && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

Input.displayName = "Input";
export default Input;
export type { InputProps };