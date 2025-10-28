import ToolRunner from '@/components/ToolRunner';

const ToolPage = async ({ params }) => {
const resolvedParams = await params;       
const tool = resolvedParams?.tool || 'unknown';

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{tool}</h1>
                    <p className="mt-2 text-sm text-gray-600">Upload files and apply the <span className="font-medium text-teal-600">{tool}</span> tool.</p>
                </header>

                <ToolRunner tool={tool} />
            </div>
        </div>
    );
};

export default ToolPage;