interface ToggleButtonProps {
    setValue: (value: boolean) => void;
    className: string;
}

export const ToggleButton = ({ setValue, className }: ToggleButtonProps) => {
    return (
        <label
            className={`border-border inline-flex cursor-pointer items-center rounded-full border ${className}`}
        >
            <input
                type="checkbox"
                value=""
                className="peer sr-only"
                onChange={(event) => {
                    setValue(event.target.checked);
                }}
            />
            <div className="bg-surface peer-hover:ring-accent-dim peer peer-checked:bg-brand after:bg-opposite-theme relative h-5 w-9 rounded-full peer-hover:ring-2 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
        </label>
    );
};
