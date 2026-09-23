/**
 * Release data — single source of truth for the Downloads page.
 * Mirrors what cargo-dist publishes to GitHub Releases.
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

const asset = (name: string): string =>
  `${RELEASE.repoBase}/releases/download/${RELEASE.tag}/${name}`;

export interface Target {
  os: "macOS" | "Linux" | "Windows";
  label: string;
  triple: string;
  archive: string;
  archiveExt: "tar.xz" | "zip";
  sha256: string;
}

export const TARGETS: Target[] = [
  {
    os: "macOS",
    label: "macOS · Apple Silicon",
    triple: "aarch64-apple-darwin",
    archive: "niki-aarch64-apple-darwin",
    archiveExt: "tar.xz",
    sha256: asset("niki-aarch64-apple-darwin.tar.xz.sha256"),
  },
  {
    os: "macOS",
    label: "macOS · Intel",
    triple: "x86_64-apple-darwin",
    archive: "niki-x86_64-apple-darwin",
    archiveExt: "tar.xz",
    sha256: asset("niki-x86_64-apple-darwin.tar.xz.sha256"),
  },
  {
    os: "Linux",
    label: "Linux · x86_64",
    triple: "x86_64-unknown-linux-gnu",
    archive: "niki-x86_64-unknown-linux-gnu",
    archiveExt: "tar.xz",
    sha256: asset("niki-x86_64-unknown-linux-gnu.tar.xz.sha256"),
  },
  {
    os: "Linux",
    label: "Linux · ARM64",
    triple: "aarch64-unknown-linux-gnu",
    archive: "niki-aarch64-unknown-linux-gnu",
    archiveExt: "tar.xz",
    sha256: asset("niki-aarch64-unknown-linux-gnu.tar.xz.sha256"),
  },
  {
    os: "Windows",
    label: "Windows · x86_64",
    triple: "x86_64-pc-windows-msvc",
    archive: "niki-x86_64-pc-windows-msvc",
    archiveExt: "zip",
    sha256: asset("niki-x86_64-pc-windows-msvc.zip.sha256"),
  },
];

export const INSTALLERS = {
  shell: {
    label: "Linux / macOS",
    command:
      "curl -fsSL https://raw.githubusercontent.com/RavaniRoshan/niki/master/scripts/install.sh | bash",
    note: "Checksum-verified against release checksums. Installs to ~/.local/bin.",
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
    note: "Homebrew tap — maintained formula, brew upgrade to update.",
  },
  cargo: {
    label: "Any (from source)",
    command: "cargo install niki",
    note: "Requires Rust 1.85+ (edition 2024).",
  },
} as const;

export const CHECKSUMS = {
  bundle: asset("sha256.sum"),
  note: "Every archive ships a .sha256 sidecar; the installer verifies before installing.",
};
