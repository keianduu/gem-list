import Link from 'next/link';
import Image from 'next/image';

export default function JournalPagination({ prev, next }) {
    if (!prev && !next) return null;

    return (
        <div className="w-full max-w-[800px] mx-auto mt-20 mb-16 border-t border-gray-100 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {/* PREV (Older) */}
                <div className="flex flex-col items-start text-left group">
                    {prev ? (
                        <Link href={`/journals/${prev.slug}`} className="w-full block">
                            <div className="flex gap-5 items-center">
                                {/* Thumbnail */}
                                <div className="relative w-24 h-24 flex-shrink-0 border border-gray-100 p-1 bg-white rounded-xl shadow-sm">
                                    <div className="relative w-full h-full bg-gray-50 overflow-hidden rounded-lg">
                                        {prev.thumbnail ? (
                                            <Image
                                                src={prev.thumbnail.url}
                                                alt={prev.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="100px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <span className="text-xs">No img</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    <span className="text-gold font-en text-xs font-bold uppercase tracking-wider mb-2 transition-colors">
                                        Before Journal
                                    </span>
                                    <h4 className="font-jp text-sm text-gray-700 leading-relaxed font-medium line-clamp-2 group-hover:text-gold transition-colors duration-300">
                                        {prev.title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="opacity-0 pointer-events-none" aria-hidden="true" />
                    )}
                </div>

                {/* NEXT (Newer) */}
                <div className="flex flex-col items-end text-right group">
                    {next ? (
                        <Link href={`/journals/${next.slug}`} className="w-full block">
                            <div className="flex flex-row-reverse gap-5 items-center">
                                {/* Thumbnail */}
                                <div className="relative w-24 h-24 flex-shrink-0 border border-gray-100 p-1 bg-white rounded-xl shadow-sm">
                                    <div className="relative w-full h-full bg-gray-50 overflow-hidden rounded-lg">
                                        {next.thumbnail ? (
                                            <Image
                                                src={next.thumbnail.url}
                                                alt={next.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="100px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <span className="text-xs">No img</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col items-end">
                                    <span className="text-gold font-en text-xs font-bold uppercase tracking-wider mb-2 transition-colors">
                                        Next Journal
                                    </span>
                                    <h4 className="font-jp text-sm text-gray-700 leading-relaxed font-medium line-clamp-2 group-hover:text-gold transition-colors duration-300">
                                        {next.title}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="opacity-0 pointer-events-none" aria-hidden="true" />
                    )}
                </div>
            </div>

            {/* Center link back to list (Optional decoration) */}
            <div className="text-center mt-12">
                <Link href="/search?contentType=journal" className="text-gray-400 hover:text-gold text-xs font-en tracking-widest transition-colors">
                    ← VIEW ALL JOURNALS
                </Link>
            </div>
        </div>
    );
}
