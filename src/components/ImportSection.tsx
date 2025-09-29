import {createSignal, onMount} from "solid-js";

interface ImportSectionProps {
    onImport: (url: string, filename: string, token?: string) => void;
    status?: string;
}

export default function ImportSection(props: ImportSectionProps) {
    const [gistUrl, setGistUrl] = createSignal("");
    const [filename, setFilename] = createSignal("resume.json");
    const [token, setToken] = createSignal("");

    onMount(() => {
        const savedUrl = localStorage.getItem("gistUrl");
        if (savedUrl) setGistUrl(savedUrl);
    });

    const handleGistChange = (value: string) => {
        setGistUrl(value);
        localStorage.setItem("gistUrl", value);
    };

    const handleImport = () => {
        props.onImport(gistUrl(), filename(), token() || undefined);
    };

    return (
        <section class="bg-gray-900 text-white shadow rounded-xl p-4 space-y-4 mb-2">
            <h2 class="text-xl font-semibold">Importer depuis un Gist</h2>

            <div class="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="URL Gist (https://gist.github.com/...)"
                    value={gistUrl()}
                    onInput={(e) => handleGistChange(e.currentTarget.value)}
                    class="flex-5 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    placeholder="Nom du fichier JSON (ex: resume.json)"
                    value={filename()}
                    onInput={(e) => setFilename(e.currentTarget.value)}
                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    placeholder="GitHub token (optionnel)"
                    value={token()}
                    onInput={(e) => setToken(e.currentTarget.value)}
                    class="flex-2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={handleImport}
                    class="border-blue-700 border-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    Importer
                </button>
            </div>

            {/*{props.status && (*/}
            {/*    <div class="text-sm text-gray-600">{props.status}</div>*/}
            {/*)}*/}
        </section>
    );
}
