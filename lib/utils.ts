export function extractDisplayName(email: string): string {
  const prefix = email.split("@")[0];

  const dotIndex = prefix.indexOf(".");
  const underscoreIndex = prefix.indexOf("_");
  const separatorIndex = dotIndex !== -1 ? dotIndex : underscoreIndex;

  if (separatorIndex !== -1) {
    const firstPart = prefix.slice(0, separatorIndex);
    const secondPart = prefix.slice(separatorIndex + 1);

    const first = firstPart.charAt(0).toUpperCase();
    const second = secondPart.charAt(0).toLowerCase();

    if (second) return first + second;
  }

  const first = prefix.charAt(0).toUpperCase();
  const second = prefix.charAt(1)?.toLowerCase() ?? "";
  return first + second;
}
