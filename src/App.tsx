import {createSignal, onMount} from "solid-js";
import Header from "./components/Header.js";
import ImportSection from "./components/ImportSection.js";
import Editor from "./components/Editor.js";
import Viewer from "./components/Viewer.js";

async function getHTML(): Promise<string> {
    const resp = await fetch("/api/html");
    return await resp.text();
}

async function getJSON(): Promise<any> {
    const resp = await fetch("/api/json");
    return await resp.json();
}

export default function App() {
    const [status, setStatus] = createSignal("");
    const [html, setHtml] = createSignal("Chargement…");
    const [resume, setResume] = createSignal<any | null>(null);

    onMount(async () => {
        setHtml(await getHTML());
        setResume(await getJSON());
    });

    const importFromGist = async (url: string, filename: string, token?: string) => {
        try {
            const body = { url, filename, token };
            const resp = await fetch("/api/import/gist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await resp.json().catch(() => ({}));
            if (!resp.ok) throw new Error(json.error || "Import failed");

            setStatus(`Import OK (fichier: ${json.importedFrom})`);

            setHtml(await getHTML());
            setResume(await getJSON());
        } catch (e: any) {
            setStatus(e.message || String(e));
        }
    };

    const saveJson = async () => {
        const resp = await fetch("/api/json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resume()),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(json.error || "Save failed");
        setStatus("JSON sauvegardé ✅");

        setHtml(await getHTML());
    };

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(resume(), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div class="flex flex-col w-full min-h-screen bg-gray-950 text-white p-2">
            <Header />
            <ImportSection onImport={importFromGist} status={status()} />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1 ">
                {resume() && (
                    <Editor
                        resume={resume()}
                        onChange={setResume}
                        onSave={saveJson}
                        onDownload={downloadJson}
                    />
                )}
                <Viewer html={html()} />
            </div>
        </div>
    );
}
