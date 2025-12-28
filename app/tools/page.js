"use client";

import React, { useMemo, useState } from "react";
import ToolList from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GoogleAd from "@/components/GoogleAd";

const TOOLS_PAGE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE;

export default function ToolsPage () {
    const [ query, setQuery ] = useState( "" );
    const [ category, setCategory ] = useState( "all" );

    const main = new Set( [
        "Merge PDF",
        "Split PDF",
        "Compress PDF",
        "PDF to Word",
        "Word to PDF",
        "PDF to JPG",
        "JPG to PDF",
        "Unlock PDF",
        "Protect PDF",
        "Download from YouTube"
    ] );
    const secondary = new Set( [
        "Extract pages",
        "Remove pages",
        "Rotate PDF",
        "Add watermark",
        "Add page numbers",
        "Crop PDF",
        "Organize PDF",
        "Sign PDF",
        "Download from YouTube"
    ] );
    const advanced = new Set( [
        "OCR PDF",
        "Repair PDF",
        "Redact PDF",
        "Compare PDF",
        "PDF to Excel",
        "Excel to PDF",
        "PDF to PowerPoint",
        "PowerPoint to PDF",
        "HTML to PDF",
        "PDF to PDF/A",
        "Scan to PDF",
        "Edit PDF as an object",
        "Download from YouTube"
    ] );

    const enrich = ( tool ) => {
        if ( main.has( tool.title ) ) return { ...tool, category: "Main" };
        if ( secondary.has( tool.title ) ) return { ...tool, category: "Secondary" };
        if ( advanced.has( tool.title ) ) return { ...tool, category: "Advanced" };
        return { ...tool, category: "Other" };
    };

    const tools = useMemo( () => ToolList.map( enrich ), [] );

    const filtered = useMemo( () => {
        const q = query.trim().toLowerCase();
        return tools.filter( ( t ) => {
            if ( category !== "all" && t.category.toLowerCase() !== category ) return false;
            if ( !q ) return true;
            return ( `${ t.title } ${ t.description }` ).toLowerCase().includes( q );
        } );
    }, [ tools, query, category ] );

    const counts = useMemo( () => {
        return tools.reduce(
            ( acc, t ) => {
                acc.total++;
                acc[ t.category ] = ( acc[ t.category ] || 0 ) + 1;
                return acc;
            },
            { total: 0 }
        );
    }, [ tools ] );

    const chips = [
        { id: "all", label: `All (${ counts.total || 0 })` },
        { id: "main", label: `Main (${ counts.Main || 0 })` },
        { id: "secondary", label: `Secondary (${ counts.Secondary || 0 })` },
        { id: "advanced", label: `Advanced (${ counts.Advanced || 0 })` },
    ];

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-linear-to-r from-teal-50 to-white py-12">
                <div className="max-w-6xl mx-auto px-6 md:px-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Tools</h1>
                    <p className="mt-2 text-gray-600">Browse every PDF utility grouped by category — quick filters and search help you find the right tool.</p>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            { chips.map( ( c ) => (
                                <button
                                    key={ c.id }
                                    onClick={ () => setCategory( c.id ) }
                                    className={ `px-3 py-1 rounded-full text-sm font-medium border ${ category === c.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200' } ` }
                                >
                                    { c.label }
                                </button>
                            ) ) }
                        </div>

                        <div className="relative max-w-md w-full md:w-80">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                value={ query }
                                onChange={ ( e ) => setQuery( e.target.value ) }
                                placeholder="Search tools..."
                                className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-200"
                            />
                        </div>
                    </div>
                </div>
            </header>
            {TOOLS_PAGE_AD_SLOT && (
                <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
                    <GoogleAd slot={TOOLS_PAGE_AD_SLOT} style={{ minHeight: 90 }} />
                </div>
            )}

            <main className="max-w-6xl mx-auto px-6 md:px-10 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    { filtered.map( ( tool ) => (
                        <div key={ tool.title } className="">
                            <ToolCard { ...tool } />
                        </div>
                    ) ) }
                </div>

                { filtered.length === 0 && (
                    <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        No tools match your search.
                    </div>
                ) }
            </main>
        </div>
    );
}
