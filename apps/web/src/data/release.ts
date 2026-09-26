/**
 * Release data, single source of truth for the Downloads page.
 * Provides release download metadata; asset and checksum names can vary by installer.
 * Update per release, or wire to the GitHub Releases API later.
 */

export const RELEASE = {
  version: "0.8.0",
  tag: "v0.8.0",
  date: "2026-09-23",
  notes: "https://github.com/RavaniRoshan/niki/releases/tag/v0.8.0",
  latest: "https://github.com/RavaniRoshan/niki/releases/latest",
  repoBase: "https://github.com/RavaniRoshan/niki",
} as const;

export interface Target {
  os: "macOS" | "Linux" | "Windows";
  label: string;
  triple: string;
  archive: string;
  archiveExt: "tar.xz" | "zip";
  releaseFiles: string;
}

export const TARGETS: Target[] = [
  {
    os: "macOS",
    label: "macOS · Apple Silicon",
    triple: "aarch64-apple-darwin",
    archive: "niki-aarch64-apple-darwin",
    archiveExt: "tar.xz",
    releaseFiles: RELEASE.notes,
  },
  {
    os: "macOS",
    label: "macOS · Intel",
    triple: "x86_64-apple-darwin",
    archive: "niki-x86_64-apple-darwin",
    archiveExt: "tar.xz",
    releaseFiles: RELEASE.notes,
  },
  {
    os: "Linux",
    label: "Linux · x86_64",
    triple: "x86_64-unknown-linux-gnu",
    archive: "niki-x86_64-unknown-linux-gnu",
    archiveExt: "tar.xz",
    releaseFiles: RELEASE.notes,
  },
  {
    os: "Linux",
    label: "Linux · ARM64",
    triple: "aarch64-unknown-linux-gnu",
    archive: "niki-aarch64-unknown-linux-gnu",
    archiveExt: "tar.xz",
    releaseFiles: RELEASE.notes,
  },
  {
    os: "Windows",
    label: "Windows · x86_64",
    triple: "x86_64-pc-windows-msvc",
    archive: "niki-x86_64-pc-windows-msvc",
    archiveExt: "zip",
    releaseFiles: RELEASE.notes,
  },
];

export const INSTALLERS = {
  shell: {
    label: "Linux / macOS",
    command:
      "curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/niki/master/scripts/install.sh | bash",
    note: "The repository installer resolves the latest release and verifies the downloaded archive against checksums.txt before installing.",
  },
  powershell: {
    label: "Windows",
    command:
      "irm https://github.com/RavaniRoshan/niki/releases/download/v0.8.0/niki-installer.ps1 | iex",
    note: "PowerShell installer from the current release.",
  },
  homebrew: {
    label: "macOS / Linux",
    command: "brew install niki",
    note: "Homebrew formula availability and version depend on the tap.",
  },
  cargo: {
    label: "Any (from source)",
    command: "cargo install niki",
    note: "Requires Rust 1.88+ (edition 2024).",
  },
} as const;

export const CHECKSUMS = {
  release: RELEASE.notes,
  note: "Installer and web asset names have differed; use the current release page's checksum manifest and compare the archive's SHA-256 digest before use.",
};
