// SSR result page for conversion outcomes
// Usage examples (navigate after processing):
//   /result?status=success&filename=myfile.pdf&url=/api/download/abc123
//   /result?status=error&message=Rotate%20failed
// You can also pass: title, message, contentType, data (base64 string)

import ConversionResult from '@/components/ConversionResult';

export const dynamic = 'force-dynamic'; // ensure SSR (no static optimization)
export const revalidate = 0;

export default async function Page({ searchParams }) {
  const params = await searchParams; // Next provides as plain object; "await" is harmless for future compatibility

  const status = params?.status === 'error' ? 'error' : 'success';
  const title = params?.title || undefined;
  const message = params?.message || undefined;
  const filename = params?.filename || undefined;
  const downloadUrl = params?.url || params?.downloadUrl || undefined;
  const base64Data = params?.data || undefined;
  const contentType = params?.contentType || 'application/pdf';

  return (
    <div className="min-h-[60vh] bg-gray-50">
      <ConversionResult
        status={status}
        title={title}
        message={message}
        filename={filename}
        downloadUrl={downloadUrl}
        base64Data={base64Data}
        contentType={contentType}
      />
    </div>
  );
}
