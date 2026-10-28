// ThemeContext.tsx
import React, {
    createContext, useState, useContext, ReactNode,
    Dispatch, SetStateAction, useEffect, useMemo, useCallback, useRef
} from 'react';
import { ThemeKeys, THEMES, ResolvedTheme, resolveThemeData } from './themes';
import { useApplyTheme } from './useApplyTheme';

interface ThemeContextType {
    themeName: ThemeKeys;
    setThemeName: Dispatch<SetStateAction<ThemeKeys>>;
    themeData: Record<string, any>;
    customThemes: Record<ResolvedTheme, any>;
    updateThemeColor: (category: string, colorKey: string, value: string) => void;
    resetTheme: () => void;
    applyThemeOverrides: (overrides: Record<string, any>) => void;
}

const defaultContext: ThemeContextType = {
    themeName: 'hr-light',
    setThemeName: () => { },
    themeData: THEMES.LIGHT,
    customThemes: { LIGHT: {}, DARK: {} },
    updateThemeColor: () => { },
    resetTheme: () => { },
    applyThemeOverrides: () => { },
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

interface ThemeProviderProps {
    children: ReactNode;
}

const getMergedTheme = (resolvedKey: ResolvedTheme, overrides: any) => {
    const base = THEMES[resolvedKey];
    const themeOverrides = overrides[resolvedKey] || {};
    const merged = { ...base };
    for (const cat of Object.keys(base)) {
        if (typeof base[cat] === 'object' && base[cat] !== null && !Array.isArray(base[cat])) {
            merged[cat] = { ...base[cat], ...(themeOverrides[cat] || {}) };
        } else {
            merged[cat] = themeOverrides[cat] !== undefined ? themeOverrides[cat] : base[cat];
        }
    }
    return merged;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // 1. Always default to 'hr-light' on initial app load. No localStorage!
    const [themeName, setThemeNameState] = useState<ThemeKeys>('hr-light');
    const themeBroadcastChannelRef = useRef<BroadcastChannel | null>(null);

    // Listen to theme change events from other tabs
    useEffect(() => {
        if (typeof BroadcastChannel === 'undefined') return;

        const channel = new BroadcastChannel('hr_app_channel');
        themeBroadcastChannelRef.current = channel;

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'THEME_CHANGE' && event.data.theme) {
                setThemeNameState((prev) => (prev !== event.data.theme ? event.data.theme : prev));
            }
        };

        channel.addEventListener('message', handleMessage);

        return () => {
            channel.removeEventListener('message', handleMessage);
            channel.close();
            themeBroadcastChannelRef.current = null;
        };
    }, []);

    // Broadcast theme changes to other tabs when updated locally
    const setThemeName: Dispatch<SetStateAction<ThemeKeys>> = useCallback((action) => {
        setThemeNameState((prev) => {
            const nextTheme = typeof action === 'function' ? (action as (prev: ThemeKeys) => ThemeKeys)(prev) : action;
            if (nextTheme !== prev) {
                try {
                    if (themeBroadcastChannelRef.current) {
                        themeBroadcastChannelRef.current.postMessage({ type: 'THEME_CHANGE', theme: nextTheme });
                    } else if (typeof BroadcastChannel !== 'undefined') {
                        const tempChannel = new BroadcastChannel('hr_app_channel');
                        tempChannel.postMessage({ type: 'THEME_CHANGE', theme: nextTheme });
                        tempChannel.close();
                    }
                } catch (err) {
                    console.error('Failed to broadcast theme change', err);
                }
            }
            return nextTheme;
        });
    }, []);

    // 2. Custom themes are kept in memory only for the current session.
    const [customThemes, setCustomThemes] = useState<Record<ResolvedTheme, any>>({
        LIGHT: {},
        DARK: {}
    });

    // State to force re-render when OS theme changes (for hr-system)
    const [systemThemeOverride, setSystemThemeOverride] = useState<ResolvedTheme | null>(null);

    // Listen to OS theme changes ONLY if hr-system is selected
    useEffect(() => {
        if (themeName !== 'hr-system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemThemeOverride(e.matches ? 'DARK' : 'LIGHT');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeName]);

    // Compute actual resolved key
    const resolvedKey = useMemo((): ResolvedTheme => {
        if (themeName === 'hr-system' && systemThemeOverride) {
            return systemThemeOverride;
        }
        return resolveThemeData(themeName);
    }, [themeName, systemThemeOverride]);

    // Compute memoized merged theme data
    const themeData = useMemo(() => {
        return getMergedTheme(resolvedKey, customThemes);
    }, [resolvedKey, customThemes]);

    // Apply theme to CSS variables
    useApplyTheme(themeData);

    const updateThemeColor = (category: string, colorKey: string, value: string) => {
        setCustomThemes(prev => {
            const next = { ...prev };
            if (!next[resolvedKey]) next[resolvedKey] = {};
            if (category) {
                next[resolvedKey] = { ...next[resolvedKey], [category]: { ...(next[resolvedKey][category] || {}), [colorKey]: value } };
            } else {
                next[resolvedKey] = { ...next[resolvedKey], [colorKey]: value };
            }
            return next;
        });
    };

    const resetTheme = () => {
        setCustomThemes(prev => ({ ...prev, [resolvedKey]: {} }));
    };

    const applyThemeOverrides = (overrides: Record<string, any>) => {
        setCustomThemes(prev => ({ ...prev, [resolvedKey]: overrides }));
    };

    return (
        <ThemeContext.Provider value={{ themeName, setThemeName, themeData, customThemes, updateThemeColor, resetTheme, applyThemeOverrides }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);