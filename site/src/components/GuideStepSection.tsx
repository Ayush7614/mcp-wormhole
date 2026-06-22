import type { ReactNode } from "react";
import { ConfigBlock } from "./ConfigBlock";
import type { GuideStep } from "../data/serverGuides";
import { publicAsset } from "../lib/assets";

interface GuideStepSectionProps {
  step: GuideStep;
}

function DemoTerminal({ title, asset }: { title: string; asset: string }) {
  return (
    <figure className="tutorial-demo">
      <div className="terminal-window">
        <div className="terminal-chrome">
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
          <span className="terminal-title">{title}</span>
        </div>
        <img
          src={publicAsset(asset)}
          alt={title}
          className="demo-gif"
          loading="lazy"
        />
      </div>
    </figure>
  );
}

export function GuideStepSection({ step }: GuideStepSectionProps) {
  return (
    <section className="tutorial-step" id={step.id}>
      <div className="tutorial-step-marker">
        <span className="tutorial-step-number">{step.number}</span>
      </div>
      <div className="tutorial-step-body">
        <h2>{step.title}</h2>
        <p className="tutorial-step-lead">{step.description}</p>

        {step.notice && (
          <div className="tutorial-notice">
            <p>{step.notice}</p>
          </div>
        )}

        {step.bullets && step.bullets.length > 0 && (
          <ul className="tutorial-list">
            {step.bullets.map((item) => (
              <li key={item}>{formatBullet(item)}</li>
            ))}
          </ul>
        )}

        {step.code?.map((block) => (
          <ConfigBlock key={block.label} label={block.label} language={block.language} code={block.code} />
        ))}

        {step.demo && <DemoTerminal title={step.demo.title} asset={step.demo.asset} />}

        {step.prompts && step.prompts.length > 0 && (
          <ul className="prompt-list tutorial-prompts">
            {step.prompts.map((prompt) => (
              <li key={prompt}>
                <code>&ldquo;{prompt}&rdquo;</code>
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}

function formatBullet(text: string): ReactNode {
  const match = text.match(/^`(.+)`$/);
  if (match) {
    return <code>{match[1]}</code>;
  }
  return text;
}
