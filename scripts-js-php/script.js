const partialNodes = document.querySelectorAll("[data-partial]");

function renderPartialError(node, partialPath, reason) {
    node.innerHTML = `<div class="partial-error">${reason}: ${partialPath}</div>`;
}

async function loadPartial(node) {
    const partialPath = node.dataset.partial;

    if (!partialPath) {
        return;
    }

    const response = await fetch(partialPath);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    node.innerHTML = await response.text();
    node.dataset.partialLoaded = "true";
}

async function initPartials() {
    if (window.location.protocol === "file:") {
        partialNodes.forEach((node) => {
            renderPartialError(
                node,
                node.dataset.partial || "unknown partial",
                "Use a local server to load partial"
            );
        });

        return;
    }

    await Promise.all(
        [...partialNodes].map(async (node) => {
            try {
                await loadPartial(node);
            } catch (error) {
                console.error(error);
                renderPartialError(
                    node,
                    node.dataset.partial || "unknown partial",
                    "Failed to load partial"
                );
            }
        })
    );
}

document.addEventListener("DOMContentLoaded", () => {
    void initPartials();
});
