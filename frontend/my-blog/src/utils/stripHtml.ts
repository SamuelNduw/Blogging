export function stripHtml(html: string): string {
    if (!html) return "";

    const tmp = document.createElement("div");
    tmp.innerHTML = html;

    const text = tmp.textContent || tmp.innerText || "";

    return text.replace(/\s+/g, " ").trim();
}