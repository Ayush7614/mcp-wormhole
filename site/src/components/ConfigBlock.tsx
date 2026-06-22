import { useState } from "react";

interface ConfigBlockProps {
  label: string;
  language: string;
  code: string;
}

export function ConfigBlock({ label, language, code }: ConfigBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="config-block">
      <div className="config-block-head">
        <span>
          {label} · {language}
        </span>
        <button type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
