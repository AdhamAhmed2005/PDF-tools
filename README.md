<!-- README: concise developer guide for this project -->

# PDF-tools (Next.js)

A small collection of focused PDF utilities built with Next.js (app directory). The project provides a set of tiny tools, a client-side file uploader UI, and server API routes to receive files and run per-tool processing.

This README explains how to run the project locally, the file upload flow, where uploaded files land, and recommended next steps for production/hardening.

## Quick start

1. Install dependencies

```bash
npm install
# or: pnpm install
```

2. Run development server

```bash
npm run dev
# opens on http://localhost:3000 by default
```

3. Open a tool page in your browser to test uploads:

- Example: `http://localhost:3000/tools/merge`

## Project layout (important files)

- `app/` — Next.js app routes (pages + layout)
  - `app/tools/[tool]/page.js` — tool page (server-rendered) which mounts the client upload UI
  - `app/api/tools/[tool]/fileprocess/route.js` — API endpoint that accepts uploads for a given tool
- `components/ToolRunner.jsx` — client uploader (drag & drop, file list, preview, upload)
- `actions/uploadFile.js` — helper used by the API to write uploaded files to disk
- `public/uploads/` and `uploads/` — directories where uploaded files may be stored (fallback vs helper)

## File upload flow (end-to-end)

1. User visits a tool page (e.g. `/tools/merge`). The server renders `app/tools/[tool]/page.js` which includes the `ToolRunner` client component.
2. The user selects or drags files into `ToolRunner`. The component shows a preview (client-side blob URL) and a list of selected files.
3. When the user clicks "Upload files", `ToolRunner` builds a `FormData` payload with:
   - `files[]` — each selected File appended as `files`
   - `tool` — the tool name (string)
   and POSTs it to: `/api/tools/<tool>/fileprocess`
4. The API route `app/api/tools/[tool]/fileprocess/route.js` calls `request.formData()` to parse the multipart upload, extracts files and the `tool` field, and saves files to disk using `actions/uploadFile.js`. It returns a JSON response `{ success, message, files }`.

Example client request (conceptual):

```bash
curl -X POST "http://localhost:3000/api/tools/merge/fileprocess" \
  -F "tool=merge" \
  -F "files=@/path/to/doc1.pdf" \
  -F "files=@/path/to/doc2.pdf"
```

Example successful response:

```json
{ "success": true, "message": "2 file(s) uploaded to merge", "files": ["doc1.pdf","doc2.pdf"] }
```

## Preview behavior

- `ToolRunner` shows an immediate client-side preview (via `URL.createObjectURL`) for images and PDFs — this happens before upload and does not require server storage.
- If you need persistent previews across pages or devices, upload the file to the server (or cloud storage) and return a stable URL from the API. The project currently saves uploads to `uploads/<tool>/` (via `actions/uploadFile.js`) or falls back to `public/uploads/<tool>/`.

## Security & production notes

- Sanitize filenames before writing to disk. Currently the helper uses `file.name` — replace with a generated safe name (UUID) in production.
- Validate allowed MIME types and maximum file sizes server-side.
- Avoid saving sensitive files in `public/` if they should not be publicly accessible. Use private storage and an authenticated download route or signed URLs.
- For large files, avoid buffering the entire upload in memory — use streaming parsers or direct-to-cloud uploads.

## Next improvements (suggested)

- Add server-side validation (size/type) and filename sanitization. 
- Generate thumbnails for PDFs/images to speed up previews and gallery pages.
- Add job queue / background worker for CPU-bound processing (recommended for heavy PDF algorithms).
- Return stable URLs for uploaded files and store metadata in a small DB table (owner, timestamp, original name, url).

## Contributing

Feel free to open issues or PRs. The repository follows a small, focused approach — prefer tiny, testable utilities over large monoliths.

## License

This project does not include a LICENSE file by default. Add one if you plan to open-source the project.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
