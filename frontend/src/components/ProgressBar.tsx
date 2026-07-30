interface ProgressBarProps {
    current: string;
    total: string;
    percentage: number;
}

export const ProgressBar = ({ current, total, percentage }: ProgressBarProps) => {
    const progressColor = percentage > 1 ? "bg-danger" : "bg-success";
    return (
        <div className="border-border font-body bg-surface mx-8 my-4 flex h-10 rounded-full border border-2 p-1">
            <div className="flex-1">
                <div
                    className={`${progressColor} h-full max-w-[100%] min-w-fit rounded-full transition-[width] duration-300 ease-out`}
                    style={{ width: `${percentage * 100}%` }}
                >
                    <p className="mx-3 flex h-full items-center text-right">{current}</p>
                </div>
            </div>
            <p className="text-highlight mx-3 flex items-center">{total}</p>
        </div>
    );
};
