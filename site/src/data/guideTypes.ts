export interface GuideIntro {
  title: string;
  paragraphs: string[];
  highlights: string[];
}

export interface GuidePosterStat {
  label: string;
  value: string;
}

export interface GuidePoster {
  demoAsset: string;
  demoCaption: string;
  stats: GuidePosterStat[];
}
