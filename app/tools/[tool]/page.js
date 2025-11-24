import FileUploadWithProgress from '@/components/FileUploadWithProgress';
import UrlToolRunner from '@/components/UrlToolRunner';
import tools from '@/data/tools';

const ToolPage = async ({ params }) => {
const resolvedParams = await params;       
const tool = resolvedParams?.tool || 'unknown';

// Find tool config to check if it requires URL input
const toolConfig = tools.find(t => t.href === `/tools/${tool}`);
const isUrlTool = toolConfig?.inputType === 'url';

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{toolConfig?.title || tool}</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {isUrlTool 
                            ? `Enter a URL to use the ${toolConfig?.title || tool} tool.`
                            : `Upload files and apply the ${tool} tool.`
                        }
                    </p>
                </header>

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