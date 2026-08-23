import { createElement, type ReactNode } from "react";
import { cms } from "@/cms/client";

type ScriptAttributes = Record<string, string | boolean>;
const ATTRIBUTE_NAMES: Record<string, string> = { async: "async", crossorigin: "crossOrigin", defer: "defer", fetchpriority: "fetchPriority", integrity: "integrity", nomodule: "noModule", nonce: "nonce", referrerpolicy: "referrerPolicy", src: "src", type: "type" };

export function parseHeadScript(raw: string): { attributes: ScriptAttributes; content: string } | null {
  const value = raw.trim();
  const match = value.match(/^<script\b([^>]*)>([\s\S]*)<\/script>\s*$/i);
  if (!match || /<\/script\b/i.test(match[2])) return null;
  const attributes: ScriptAttributes = {};
  const pattern = /([A-Za-z_:][A-Za-z0-9:._-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let cursor = 0;
  let attribute: RegExpExecArray | null;
  while ((attribute = pattern.exec(match[1]))) {
    if (!/^\s*$/.test(match[1].slice(cursor, attribute.index))) return null;
    const name = attribute[1].toLowerCase();
    const property = ATTRIBUTE_NAMES[name] ?? (name.startsWith("data-") ? name : null);
    if (!property) return null;
    attributes[property] = attribute[2] ?? attribute[3] ?? attribute[4] ?? true;
    cursor = pattern.lastIndex;
  }
  if (!/^\s*$/.test(match[1].slice(cursor))) return null;
  return { attributes, content: match[2] };
}

export async function CmsHeadScripts(): Promise<ReactNode> {
  const profile = await cms.siteProfile().catch(() => null);
  const scripts = profile?.head_scripts ?? [];
  return scripts.flatMap((raw, index) => {
    const parsed = typeof raw === "string" ? parseHeadScript(raw) : null;
    return parsed ? [createElement("script", { key: index, ...parsed.attributes, dangerouslySetInnerHTML: parsed.content ? { __html: parsed.content } : undefined })] : [];
  });
}
