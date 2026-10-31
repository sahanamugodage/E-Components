import React from 'react';
import { LucideIcon, X } from 'lucide-react';
import CheckBox from '../Checkbox/CheckBox';
import './Chip.scss';

type type = 'default' | 'checkbox' | 'icon' | 'none';

interface IChipComponent {
    icon?: LucideIcon;
    size?: number;
    position?: 'start' | 'end';
}

interface ChipProps {
    label: string;
    variant?: 'filled' | 'outlined';
    type?: type;
    color?: string;
    style?: React.CSSProperties;
    icon?: IChipComponent;
    disabled?: boolean;
    className?: string;
    checked?: boolean;
    onDelete?: () => void;
    onClick?: () => void;
    onCheck?: (checked: boolean) => void;
}

const Chip: React.FC<ChipProps> = ({
    label,
    variant = 'filled',
    type = 'default',
    color,
    style,
    icon,                          // ← no default now
    disabled = false,
    className = '',
    checked = false,
    onDelete,
    onClick,
    onCheck,
}) => {
    const dynamicStyles: React.CSSProperties = {};

    if (color) {
        dynamicStyles.color = color;
    }

    if (type === 'checkbox') {
        dynamicStyles.padding = '0.2rem';
        dynamicStyles.borderColor = 'var(--primary)';
        dynamicStyles.color = 'var(--primary)';
    }

    const finalStyles: React.CSSProperties = { ...dynamicStyles, ...style };

    const classes = [
        'chip-root',
        `chip-${variant}`,
        onClick || onCheck ? 'chip-clickable' : '',
        disabled ? 'chip-disabled' : '',
        className,
    ].filter(Boolean).join(' ');

    const handleClick = () => {
        if (disabled) return;
        if (type === 'checkbox' && onCheck) {
            onCheck(!checked);
        } else if (onClick) {
            onClick();
        }
    };

    const renderIcon = () => {
        if (!icon?.icon) return null;
        const IconComp = icon.icon;
        const size = icon.size ?? 13;
        return (
            <span
                className="chip-icon"
                style={{ order: icon.position === 'end' ? 2 : 0 }}
            >
                <IconComp size={size} />
            </span>
        );
    };

    const renderIndicator = () => {
        if (type === 'none') return null;

        if (type === 'checkbox') {
            return (
                <CheckBox
                    checked={checked}
                    onChange={(val) => onCheck?.(val)}
                    onClick={(e) => e.stopPropagation()}
                />
            );
        }

        if (type === 'icon') return renderIcon();

        // default — show CSS dot only if no custom icon passed
        if (icon?.icon) return renderIcon();
        return <span className="chip-dot" />;
    };

    return (
        <div
            className={classes}
            style={finalStyles}
            onClick={handleClick}
            role={onClick || onCheck ? 'button' : undefined}
            tabIndex={onClick || onCheck ? 0 : undefined}
        >
            {renderIndicator()}
            <span className="chip-label">{label}</span>
            {onDelete && (
                <span
                    className="chip-delete-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) onDelete();
                    }}
                >
                    <X size={12} />
                </span>
            )}
        </div>
    );
};

export default Chip;