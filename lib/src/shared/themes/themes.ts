export type ThemeKeys = 'hr-light' | 'hr-dark' | 'hr-system';
export type ResolvedTheme = 'LIGHT' | 'DARK';

export const THEMES: Record<ResolvedTheme, Record<string, any>> = {
    LIGHT: {
        "--protal": {
            "--background": "#FFFFFF",
            "--text": "#252424ff",
            "--surface": "whitesmoke",
            "--primary": "#085fc2",
            "--secondary": "#1E40AF",
            "--accent": "#cce4ffff",
            "--success": "#16A34A",
            "--success--light": "#97ffacff",
            "--danger": "#DC2626",
            "--danger--light": "#FEE2E2",
            "--warning": "#fcde37",
            "--warning--light": "#FEF3C7",
            "--info": "#44e3ffff",
            "--info--light": "#E0F2FE",
        },
        "--main": {
            "--background": "#3e16a3",
            "--text": "#fafafa",
            "--border": "#3e16a3"
        },
        "--text": {
            "--primary": "#252424ff",
            "--secondary": "#4B5563"
        },
        "--background": {
            "--primary": "#085fc2",
            "--secondary": "#fafafa",
            "--surface": "#fafafa",
            "--body": "#fafafa",
            "--smoke": "whitesmoke",
            "--success": "#16A34A",
            "--disable": "#cccccc"
        },
        "--border": {
            "--default": "#E5E7EB",
            "--light": "#F3F4F6"
        },
        "--table": {
            "--background": "#FFFFFF",
            "--text": "#252424ff",
            "--border": "#E5E7EB",
            "--selected": "#1ae8271a"
        },
        "--alert": {
            "--background": "#FFFFFF",
            "--title": "#252424ff",
            "--message": "#4B5563",
            "--border": "#E5E7EB",
            "--shadow": "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "--cancel-text": "#4B5563",
            "--cancel-border": "#E5E7EB",
            "--cancel-hover-bg": "whitesmoke",
            "--cancel-hover-text": "#252424ff",
            "--btn-text": "#FFFFFF",
            "--success": "#16A34A",
            "--success--light": "#97ffacff",
            "--error": "#DC2626",
            "--error--light": "#FEE2E2",
            "--warning": "#fcde37",
            "--warning--light": "#FEF3C7",
            "--warning--text": "#252424ff",
            "--info": "#085fc2",
            "--info--light": "#E0F2FE"
        },
        "--shadow": {
            "--default": "rgba(0, 0, 0, 0.16) 0px 1px 4px"
        },
        "--radius": {
            "--default": "1rem"
        },
        "--font": {
            "--default": "11px",
            "--size": "11px",
            "--family": "Work Sans"
        },
        "--avatar": {
            "--1": "#6366f1",
            "--2": "#0ea5e9",
            "--3": "#10b981",
            "--4": "#d97706",
            "--5": "#a855f7",
            "--6": "#ec4899",
            "--7": "#14b8a6",
            "--8": "#f43f5e",
            "--9": "#3b82f6",
            "--10": "#65a30d",
            "--text": "#ffffff",
        },
        "--overlay": "rgba(37, 36, 36, 0.5)",
    },
    DARK: {
        "--protal": {
            "--background": "#1a1a1a",
            "--text": "#e5e5e5",
            "--surface": "#2d2d2d",
            "--primary": "#3b82f6",
            "--secondary": "#60A5FA",
            "--accent": "#1e3a5f",
            "--success": "#22C55E",
            "--success--light": "#14532d",
            "--danger": "#EF4444",
            "--danger--light": "#7f1d1d",
            "--warning": "#facc15",
            "--warning--light": "#78350f",
            "--info": "#38bdf8",
            "--info--light": "#0c4a6e",
        },
        "--main": {
            "--background": "#6d28d9",
            "--text": "#fafafa",
            "--border": "#6d28d9"
        },
        "--text": {
            "--primary": "#e5e5e5",
            "--secondary": "#9CA3AF"
        },
        "--background": {
            "--primary": "#1e3a5f",
            "--secondary": "#1a1a1a",
            "--surface": "#2d2d2d",
            "--body": "#121212",
            "--smoke": "#2d2d2d",
            "--success": "#14532d",
            "--disable": "#4a4a4a"
        },
        "--border": {
            "--default": "#374151",
            "--light": "#4B5563"
        },
        "--table": {
            "--background": "#1a1a1a",
            "--text": "#e5e5e5",
            "--border": "#374151",
            "--selected": "#3b82f61a"
        },
        "--alert": {
            "--background": "#1a1a1a",
            "--title": "#e5e5e5",
            "--message": "#9CA3AF",
            "--border": "#374151",
            "--shadow": "rgba(0, 0, 0, 0.5) 0px 1px 4px",
            "--cancel-text": "#9CA3AF",
            "--cancel-border": "#374151",
            "--cancel-hover-bg": "#2d2d2d",
            "--cancel-hover-text": "#e5e5e5",
            "--btn-text": "#FFFFFF",
            "--success": "#22C55E",
            "--success--light": "#14532d",
            "--error": "#EF4444",
            "--error--light": "#7f1d1d",
            "--warning": "#facc15",
            "--warning--light": "#78350f",
            "--warning--text": "#252424ff",
            "--info": "#3b82f6",
            "--info--light": "#0c4a6e"
        },
        "--shadow": {
            "--default": "rgba(0, 0, 0, 0.5) 0px 1px 4px"
        },
        "--radius": {
            "--default": "1rem"
        },
        "--font": {
            "--default": "12px",
            "--family": "Work Sans"
        },
        "--avatar": {
            "--1": "#6366f1",
            "--2": "#0ea5e9",
            "--3": "#10b981",
            "--4": "#f59e0b",
            "--5": "#a855f7",
            "--6": "#ec4899",
            "--7": "#14b8a6",
            "--8": "#f43f5e",
            "--9": "#3b82f6",
            "--10": "#84cc16",
            "--text": "#ffffff",
        },
        "--overlay": "rgba(0, 0, 0, 0.7)",
    },
};

export const resolveThemeData = (key: ThemeKeys): ResolvedTheme => {
    if (key === 'hr-dark') return 'DARK';

    if (key === 'hr-system') {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'DARK';
        }
        return 'LIGHT';
    }

    return 'LIGHT';
};