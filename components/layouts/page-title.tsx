interface PageTitleProps {
    pillText: string;
    pageTitle: string;
    pageTitleHighlighted: string;
    description: string | React.ReactNode;
}

export default function PageTitle({
    pillText,
    pageTitle,
    pageTitleHighlighted,
    description,
}: PageTitleProps) {
    return (
        <section className="w-full bg-[#F4F7F3] dark:bg-neutral-900 relative">
            <div className="container mx-auto px-4 py-12 md:py-16 flex items-center justify-center">
                {/* Content wrapper with max-width */}
                <div className="w-full max-w-[720px] flex flex-col items-center text-center space-y-6">
                    {/* Pill */}
                    <div
                        className="px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
                        style={{
                            background: 'oklch(0.5 0.134 242.749)',
                        }}
                    >
                        {pillText}
                    </div>

                    {/* H1 */}
                    <h1
                        className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
                        style={{
                            letterSpacing: '-1px',
                        }}
                    >
                        {pageTitle}{' '}
                        <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>
                            {pageTitleHighlighted}
                        </span>
                    </h1>

                    {/* P */}
                    <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 max-w-[600px]">
                        {description}
                    </p>

                    {/* Divider */}
                    <div
                        className="w-full max-w-[360px] h-[2px]"
                        style={{
                            backgroundColor: 'oklch(0.5 0.134 242.749)',
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
