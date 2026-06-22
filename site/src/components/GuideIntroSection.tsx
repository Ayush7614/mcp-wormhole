import type { GuideIntro } from "../data/guideTypes";

interface GuideIntroSectionProps {
  intro: GuideIntro;
}

export function GuideIntroSection({ intro }: GuideIntroSectionProps) {
  return (
    <section className="guide-intro" id="intro">
      <h2>{intro.title}</h2>
      {intro.paragraphs.map((paragraph) => (
        <p key={paragraph} className="guide-intro-lead">
          {paragraph}
        </p>
      ))}
      {intro.highlights.length > 0 && (
        <ul className="guide-intro-highlights">
          {intro.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
