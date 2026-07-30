interface ProgressBarProps {
    current: string;
    total: string;
    percentage: number;
}

export const ProgressBar = ({ current, total, percentage }: ProgressBarProps) => {
    const progressColor = percentage > 1 ? "bg-danger" : "bg-success";
    return (
        <div className="font-body bg-surface-raised m-2 flex h-10 rounded-full">
            <div className="m-2 flex-1">
                <div
                    className={`${progressColor} max-w-[100%] min-w-fit rounded-full transition-[width] duration-300 ease-out`}
                    style={{ width: `${percentage * 100}%` }}
                >
                    <p className="mx-3 text-right">{current}</p>
                </div>
            </div>
            <p className="text-highlight m-2 mr-3 ml-auto">{total}</p>
        </div>
    );
};
