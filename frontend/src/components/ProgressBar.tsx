interface ProgressBarProps {
    label: string;
    rightLabel: string;
    barLabel: string;
    percentage: number;
}

export const ProgressBar = ({ label, barLabel, rightLabel, percentage }: ProgressBarProps) => {
    const progressColor = percentage > 1 ? "bg-danger" : "bg-success";
    return (
        <div className="mx-8 my-4">
            <div className="flex justify-between">
                <p className="text-highlight mx-2">{label}</p>
                <p className="text-highlight mx-4">{rightLabel}</p>
            </div>
            <div className="border-border font-body bg-surface h-10 rounded-full border border-2 p-1">
                <div
                    className={`${progressColor} h-full max-w-[100%] min-w-fit rounded-full transition-[width] duration-300 ease-out`}
                    style={{ width: `${percentage * 100}%` }}
                >
                    <p className="mx-3 justify-end flex h-full items-center text-right">{barLabel}</p>
                </div>
            </div>
        </div>
    );
};
