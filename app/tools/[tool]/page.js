import FileUploadWithProgress from '@/features/tools/ui/FileUploadWithProgress';
import UrlToolRunner from '@/features/tools/ui/UrlToolRunner';
import GoogleAd from '@/shared/ui/GoogleAd';
import tools from '@/features/tools/constants/tools';

const TOOL_PAGE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE;

const ToolPage = async ({ params }) => {
const resolvedParams = await params;       
const tool = resolvedParams?.tool || 'unknown';

// Find tool config to check if it requires URL input
const toolConfig = tools.find(t => t.href === `/tools/${tool}`);
const isUrlTool = toolConfig?.inputType === 'url';
const toolTier = toolConfig?.tier;
const isPremium = toolTier === 'premium';
const isFeatured = toolConfig?.featured;

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex flex-wrap items-center gap-3">
                        <span>{toolConfig?.title || tool}</span>
                        {toolTier && (
                            <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${isPremium ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}
                            >
                                {isPremium ? 'Premium' : 'Freemium'}
                            </span>
                        )}
                        {isFeatured && (
                            <span className="inline-flex items-center rounded-full bg-amber-600 px-2 py-0.5 text-xs font-semibold text-white">
                                Featured
                            </span>
                        )}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {isUrlTool 
                            ? `Enter a URL to use the ${toolConfig?.title || tool} tool.`
                            : `Upload files and apply the ${tool} tool.`
                        }
                    </p>
                </header>
                {TOOL_PAGE_AD_SLOT && (
                    <div className="max-w-4xl mx-auto py-6">
                        <GoogleAd slot={TOOL_PAGE_AD_SLOT} style={{ minHeight: 90 }} />
                    </div>
                )}

                {isUrlTool ? (
                    <UrlToolRunner tool={tool} />
                ) : (
                    <FileUploadWithProgress tool={tool} accept=".pdf" multiple={true} />
                )}
            </div>
        </div>
    );
};

export default ToolPage;
