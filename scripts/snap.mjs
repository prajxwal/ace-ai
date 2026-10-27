// Captures key states at the Mac reference viewport for visual comparison.
// Usage: npm run snap  (dev server must be running; BASE_URL defaults to http://localhost:3100)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = "snapshots";
// Mac references (#3–#8) are 1600×1000 with the page area starting at y=118: 1600×882.
const viewport = { width: 1600, height: 882 };

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
const ui = (id) => page.locator(`[data-ui-id="${id}"]`);

async function go(path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  await page.mouse.move(0, 0);
}
async function shot(name) {
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("saved", name);
}

await go("/find");
await shot("find-default");

// Reference #3: first chat open in the preview panel.
await ui("chat-list.item.chat-ref-1").locator("div").first().click();
await page.mouse.move(0, 0);
await shot("find-chat-open");

// Reference #1: Read status = Unread + Agent/Team = an agent with no unread chats.
await go("/find");
await ui("filter.readStatus").click();
await ui("filter.readStatus.option.unread").click();
await ui("filter.agentTeam").click();
await ui("filter.agentTeam.option.agent-anusha").click();
await page.keyboard.press("Escape");
await page.mouse.move(0, 0);
await shot("find-filtered-no-results");

await go("/my-chats");
await shot("my-chats");
await ui("my-chats.item.chat-my-2").click();
await page.mouse.move(0, 0);
await shot("my-chats-open");

await go("/all-features");
await shot("all-features");
await page.mouse.move(900, 500);
await page.mouse.wheel(0, 700);
await shot("all-features-scrolled");
await ui("all-features.card.broadcast").click({ trial: false }).catch(() => {});
await shot("all-features-coming-soon");

await browser.close();
