"use client";

import React, { useMemo, useState } from "react";
import ToolList from "@/features/tools/constants/tools";
import ToolCard from "@/features/tools/ui/ToolCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GoogleAd from "@/shared/ui/GoogleAd";

const TOOLS_PAGE_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_PAGE;

const MAIN_TOOLS = new Set( [
    "Compress PDF",
    "PDF to Word",
    "PDF to Excel",
    "PDF to JPG",
    "Download TikTok Video",
    "Download YouTube Video"
] );
const SECONDARY_TOOLS = new Set( [
    "Rotate PDF",
] );
const ADVANCED_TOOLS = new Set( [] );

const enrichTool = ( tool ) => {
    if ( MAIN_TOOLS.has( tool.title ) ) return { ...tool, category: "Main", tier: tool.tier || "freemium" };
    if ( SECONDARY_TOOLS.has( tool.title ) ) return { ...tool, category: "Secondary", tier: tool.tier || "freemium" };
    if ( ADVANCED_TOOLS.has( tool.title ) ) return { ...tool, category: "Advanced", tier: tool.tier || "freemium" };
    return { ...tool, category: "Other", tier: tool.tier || "freemium" };
};

export default function ToolsPageView () {
    const [ query, setQuery ] = useState( "" );
    const [ category, setCategory ] = useState( "all" );
    const [ tier, setTier ] = useState( "all" );
    const tools = useMemo( () => ToolList.map( enrichTool ), [] );

    const filtered = useMemo( () => {
        const q = query.trim().toLowerCase();
        return tools.filter( ( t ) => {
            if ( tier !== "all" && t.tier !== tier ) return false;
            if ( category !== "all" && t.category.toLowerCase() !== category ) return false;
            if ( !q ) return true;
            return ( `${ t.title } ${ t.description }` ).toLowerCase().includes( q );
        } );
    }, [ tools, query, category, tier ] );

    const featuredTools = useMemo(
        () => filtered.filter( ( tool ) => tool.featured ),
        [ filtered ]
    );

    const regularTools = useMemo(
        () => filtered.filter( ( tool ) => !tool.featured ),
        [ filtered ]
    );

    const groupedTools = useMemo( () => {
        const groups = {
            premium: {},
            freemium: {},
        };

        for ( const tool of regularTools ) {
            const tierKey = tool.tier || "freemium";
            const categoryKey = tool.category || "Other";
            if ( !groups[ tierKey ][ categoryKey ] ) groups[ tierKey ][ categoryKey ] = [];
            groups[ tierKey ][ categoryKey ].push( tool );
        }

        for ( const tierKey of Object.keys( groups ) ) {
            for ( const categoryKey of Object.keys( groups[ tierKey ] ) ) {
                groups[ tierKey ][ categoryKey ].sort( ( a, b ) => a.title.localeCompare( b.title ) );
            }
        }

        return groups;
    }, [ regularTools ] );

    const categoryOrder = [ "Main", "Secondary", "Advanced", "Other" ];
    const tierOrder = [ "premium", "freemium" ];

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

    const tierCounts = useMemo( () => {
        return tools.reduce(
            ( acc, t ) => {
                acc.total++;
                const key = t.tier || "freemium";
                acc[ key ] = ( acc[ key ] || 0 ) + 1;
                return acc;
            },
            { total: 0 }
        );
    }, [ tools ] );

    const tierChips = [
        { id: "all", label: `All (${ tierCounts.total || 0 })` },
        { id: "freemium", label: `Freemium (${ tierCounts.freemium || 0 })` },
        { id: "premium", label: `Premium (${ tierCounts.premium || 0 })` },
    ];

    const chips = [
        { id: "all", label: `All (${ counts.total || 0 })`, count: counts.total || 0 },
        { id: "main", label: `Main (${ counts.Main || 0 })`, count: counts.Main || 0 },
        { id: "secondary", label: `Secondary (${ counts.Secondary || 0 })`, count: counts.Secondary || 0 },
        { id: "advanced", label: `Advanced (${ counts.Advanced || 0 })`, count: counts.Advanced || 0 },
        { id: "other", label: `Other (${ counts.Other || 0 })`, count: counts.Other || 0 },
    ].filter( ( chip ) => chip.id === "all" || chip.count > 0 )
        .map( ( chip ) => ( { id: chip.id, label: chip.label } ) );

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-linear-to-r from-teal-50 to-white py-12">
                <div className="max-w-6xl mx-auto px-6 md:px-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Tools</h1>
                    <p className="mt-2 text-gray-600">Browse tools by tier and category — filters and search keep the list focused.</p>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                { tierChips.map( ( c ) => (
                                    <button
                                        key={ c.id }
                                        onClick={ () => setTier( c.id ) }
                                        className={ `px-3 py-1 rounded-full text-sm font-medium border ${ tier === c.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200' } ` }
                                    >
                                        { c.label }
                                    </button>
                                ) ) }
                            </div>
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
                {featuredTools.length > 0 && (
                    <section className="mb-12">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Featured</p>
                                <h2 className="text-xl font-bold text-gray-900">Premium downloads</h2>
                            </div>
                            <p className="text-sm text-gray-500">{featuredTools.length} highlighted</p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredTools.map( ( tool ) => (
                                <ToolCard key={ tool.title } { ...tool } />
                            ) )}
                        </div>
                    </section>
                )}

                {tierOrder.map( ( tierKey ) => {
                    const tierLabel = tierKey === "premium" ? "Premium tools" : "Freemium tools";
                    const categories = categoryOrder.filter(
                        ( categoryName ) => groupedTools[ tierKey ]?.[ categoryName ]?.length
                    );

                    if ( categories.length === 0 ) return null;

                    return (
                        <section key={ tierKey } className="mb-12">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-xl font-bold text-gray-900">{tierLabel}</h2>
                                <p className="text-sm text-gray-500">
                                    {categories.reduce( ( total, cat ) => total + groupedTools[ tierKey ][ cat ].length, 0 )} tools
                                </p>
                            </div>

                            {categories.map( ( categoryName ) => (
                                <div key={ categoryName } className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                            {categoryName}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {groupedTools[ tierKey ][ categoryName ].length}
                                        </span>
                                    </div>
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {groupedTools[ tierKey ][ categoryName ].map( ( tool ) => (
                                            <ToolCard key={ tool.title } { ...tool } />
                                        ))}
                                    </div>
                                </div>
                            ) )}
                        </section>
                    );
                } )}

                { filtered.length === 0 && (
                    <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                        No tools match your search.
                    </div>
                ) }
            </main>
        </div>
    );
}
