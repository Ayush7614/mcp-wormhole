export function npmPackageUrl(pkg: string): string {
  return `https://www.npmjs.com/package/${pkg}`;
}

export function npmVersionBadgeUrl(pkg: string): string {
  return `https://img.shields.io/npm/v/${encodeURIComponent(pkg)}?style=for-the-badge&logo=npm`;
}

export function npmDownloadsBadgeUrl(pkg: string): string {
  return `https://img.shields.io/npm/dw/${encodeURIComponent(pkg)}?style=for-the-badge&logo=npm&label=downloads`;
}
