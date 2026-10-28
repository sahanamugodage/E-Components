import { useEffect } from 'react';

export const useApplyTheme = (theme: Record<string, any>) => {
  useEffect(() => {
    const root = document.documentElement;
    const rawTheme = theme;
    
    if (!rawTheme) return;

    // ✅ Flatten nested structure first!
    const flatTheme = flattenTheme(rawTheme);
    
    // Apply all CSS variables
    for (const [cssVar, value] of Object.entries(flatTheme)) {
      root.style.setProperty(cssVar, value);
    }
    
  }, [theme]);
};

// utils/flattenTheme.ts
export function flattenTheme(
  theme: Record<string, any>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(theme)) {
    const fullKey = prefix ? `${prefix}${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      const nested = flattenTheme(value, `${fullKey}`);
      Object.assign(result, nested);
    } else {
      // Base case: assign value
      result[fullKey] = value;
    }
  }
  
  return result;
}