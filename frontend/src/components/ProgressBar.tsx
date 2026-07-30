interface ProgressBarProps {
    current: string;
    total: string;
    percentage: number;
}

export const ProgressBar = ({ current, total, percentage }: ProgressBarProps) => {
    return (
        <div className="font-body bg-surface-raised m-2 flex h-10 rounded-full">
            <div
                className={`bg-success sticky m-2 min-w-fit rounded-full transition-[width] duration-300 ease-out`}
                style={{ width: `${percentage * 100}%` }}
            >
                <p className="right mx-3 text-right">{current}</p>
            </div>
            <p className="text-highlight m-2 mr-3 ml-auto">{total}</p>
        </div>
    );
};
