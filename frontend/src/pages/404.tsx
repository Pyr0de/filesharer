import { Button } from "../components/Button";

export const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-2xl text-center">
                <div className="relative">
                    <span className="text-text text-[10rem] leading-none font-black tracking-tighter sm:text-[14rem]">
                        404
                    </span>
                </div>

                <h1 className="text-text mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                    Page not found
                </h1>

                <p className="text-highlight mx-auto mt-4 max-w-md text-base leading-7 sm:text-lg">
                    Sorry, we couldn't find the page you're looking for. It may have been moved,
                    deleted, or the URL might be incorrect.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button
                        onClick={() => window.history.back()}
                        className="inline-flex w-full items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition sm:w-auto"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};
