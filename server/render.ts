export function renderResumeHTML(r: any): string {
    const basics = r?.basics ?? {};
    const work = Array.isArray(r?.work) ? r.work : [];
    const skills = Array.isArray(r?.skills) ? r.skills : [];
    const education = Array.isArray(r?.education) ? r.education : [];
    const esc = (s: any) => String(s ?? "").replace(/[&<>]/g, (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));


    return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(basics.name || "CV")}</title>
<style>
:root{--ink:#0f172a;--muted:#475569;--acc:#2563eb}
*{box-sizing:border-box} body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:32px;color:var(--ink);}
.wrap{max-width:900px;margin:0 auto}
h1{margin:0 0 4px;font-size:28px}
h2{margin:24px 0 8px;font-size:18px;border-bottom:2px solid #e5e7eb;padding-bottom:4px}
ul{padding-left:18px}
.muted{color:var(--muted)} .chip{display:inline-block;padding:4px 8px;border:1px solid #e5e7eb;border-radius:999px;margin:2px}
</style>
</head>
<body>
<div class="wrap">
<header>
<h1>${esc(basics.name || "Nom inconnu")}</h1>
<div class="muted">${esc(basics.label || "")}${basics.email ? " – " + esc(basics.email) : ""}</div>
${basics.summary ? `<p>${esc(basics.summary)}</p>` : ""}
</header>


${work.length ? `<h2>Expériences</h2>` : ""}
<section>
${work
        .map((w: any) => `
<div>
<strong>${esc(w.position || "Poste")}</strong> @ ${esc(w.name || "Entreprise")}
${w.startDate ? `<span class="muted"> · ${esc(w.startDate)}${w.endDate ? " → " + esc(w.endDate) : ""}</span>` : ""}
${w.summary ? `<div>${esc(w.summary)}</div>` : ""}
</div>`)
        .join("")}
</section>


${skills.length ? `<h2>Compétences</h2>` : ""}
<section>
${skills.map((s: any) => `<span class="chip">${esc(s.name || s)}</span>`).join(" ")}
</section>


${education.length ? `<h2>Formation</h2>` : ""}
<section>
<ul>
${education
        .map((e: any) => `<li>${esc(e.studyType || "")} — ${esc(e.area || "")} @ ${esc(e.institution || "")}</li>`)
        .join("")}
</ul>
</section>
</div>
</body>
</html>`;
}