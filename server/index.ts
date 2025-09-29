import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";
import {renderResumeHTML} from "./render.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const API_PORT = 5174;
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const RESUME_JSON = path.join(DATA_DIR, "resume.json");
const RESUME_HTML = path.join(DATA_DIR, "resume.html");


app.use(cors());
app.use(express.json({limit: "1mb"}));


async function ensureDataFiles() {
    await fs.mkdir(DATA_DIR, {recursive: true});
    try {
        await fs.access(RESUME_HTML);
    } catch {
// Si pas d'HTML, on génère depuis un JSON d'exemple
        const sample = {
            basics: {
                name: "Ada Lovelace",
                label: "Software Engineer",
                email: "ada@example.com",
                summary: "Pionnière de la programmation."
            },
            work: [{name: "Analytical Engines Inc.", position: "Engineer", startDate: "1843-01"}],
            skills: [{name: "Algorithms"}, {name: "Technical Writing"}],
            education: [{institution: "Self-Study", area: "Mathematics", studyType: "N/A"}]
        };
        await fs.writeFile(RESUME_JSON, JSON.stringify(sample, null, 2), "utf8");
        await fs.writeFile(RESUME_HTML, renderResumeHTML(sample), "utf8");
    }
}


function extractGistIdFromUrl(url: string): string | null {
// N'accepte **que** les URLs gist.github.com
    const m = /^https?:\/\/gist\.github\.com\/[^/]+\/([0-9a-f]+)(?:$|\b|\/)/i.exec(url.trim());
    return m ? m[1] : null;
}


app.get("/api/health", (_req, res) => res.json({ok: true}));


app.get("/api/html", async (_req, res) => {
    try {
        await ensureDataFiles();
        const html = await fs.readFile(RESUME_HTML, "utf8");
        res.type("text/html").send(html);
    } catch (e) {
        res.status(500).json({error: "Unable to read resume.html"});
    }
});


app.put("/api/html", async (req, res) => {
    try {
        const {html} = req.body || {};
        if (typeof html !== "string") return res.status(400).json({error: "Body must have a string 'html'"});
        await fs.writeFile(RESUME_HTML, html, "utf8");
        res.json({ok: true});
    } catch (e) {
        res.status(500).json({error: "Unable to save resume.html"});
    }
});

app.get("/api/json", async (_req, res) => {
    try {
        await ensureDataFiles();
        const jsonStr = await fs.readFile(RESUME_JSON, "utf8");
        const json = JSON.parse(jsonStr);
        res.json(json);
    } catch (e) {
        res.status(500).json({error: "Unable to read or parse resume.json"});
    }
});


app.post("/api/import/gist", async (req, res) => {
    try {
        const {url, filename = "resume.json", token} = req.body || {};
        if (typeof url !== "string") return res.status(400).json({error: "Provide a Gist URL (https://gist.github.com/...)"});
        const id = extractGistIdFromUrl(url);
        if (!id) return res.status(400).json({error: "Invalid Gist URL. Expected https://gist.github.com/<user>/<id>"});


        const headers: Record<string, string> = {"User-Agent": "json-resume-solid-html-editor"};
        if (token) headers["Authorization"] = `Bearer ${token}`;


        const resp = await fetch(`https://api.github.com/gists/${id}`, {headers});
        if (!resp.ok) {
            const text = await resp.text();
            return res.status(resp.status).json({error: `GitHub API: ${text}`});
        }
        const data: any = await resp.json();
        const files = data.files || {};


        let fileKey: string | null = null;
        if (files[filename]) fileKey = filename; else if (files["resume.json"]) fileKey = "resume.json"; else fileKey = Object.keys(files).find((k) => k.toLowerCase().endsWith(".json")) || null;


        if (!fileKey) return res.status(404).json({error: "No JSON file found in this Gist"});
        const content = files[fileKey]?.content;
        if (typeof content !== "string") return res.status(400).json({error: "Selected Gist file has no content"});


        let parsed: any;
        try {
            parsed = JSON.parse(content);
        } catch {
            return res.status(400).json({error: "Gist content is not valid JSON"});
        }


        await fs.mkdir(DATA_DIR, {recursive: true});
        await fs.writeFile(RESUME_JSON, JSON.stringify(parsed, null, 2), "utf8");
        await fs.writeFile(RESUME_HTML, renderResumeHTML(parsed), "utf8");


        res.json({ok: true, importedFrom: fileKey});
    } catch (e) {
        res.status(500).json({error: "Failed to import from Gist"});
    }
});


// En prod, servir le build Vite
app.use(express.static(path.join(ROOT, "dist", "client")));
// app.get("*", (_req, res) => {
//     res.sendFile(path.join(ROOT, "dist", "client", "index.html"));
// });


app.listen(API_PORT, async () => {
    await ensureDataFiles();
    console.log(`✔ API running on http://localhost:${API_PORT}`);
});