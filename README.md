# Skill Switch

[![CI](https://github.com/messlatte/skill-switch/actions/workflows/ci.yml/badge.svg)](https://github.com/messlatte/skill-switch/actions/workflows/ci.yml)

Windows desktop app for turning Claude Code skills on and off without moving folders by hand. Built with Tauri 2, React and Rust. The UI is in German.

## Features

- **Skills:** lists the skills in `~/.claude/skills` and `~/.claude/skills-disabled` with name and description from `SKILL.md`. Each skill has three states:
  - *Aktiv*: Claude sees the skill and can use it on its own.
  - *Manuell*: only callable via `/name`. The app sets `skillOverrides` in `~/.claude/settings.json` and leaves the rest of the file as it is.
  - *Aus*: moves the folder to `skills-disabled`. Nothing is deleted, and the move stops if a folder with the same name is already there.
- **Groups:** if `~/.agents/.skill-lock.json` exists, skills are grouped by the repo they were installed from, with a link to the repo and one switch for the whole group.
- **Profiles:** save the current skill states under a name and apply them again later.
- **Usage:** reads the local transcripts in `~/.claude/projects` and shows where the usage limit goes (context size, long sessions, effort, limit hits). Only metadata is read, not the prompts.
- **Live:** running sessions with their current context size and a hint when to compact. Optional Windows notifications, and a hook that warns inside Claude Code shortly before auto-compact.
- **OmniRoute:** routes single CLI projects through a local [OmniRoute](https://github.com/diegosouzapw/OmniRoute) proxy by writing to the project's `.claude/settings.local.json`. Never global, and Claude Desktop is not affected.
- Read-only list of installed plugins and MCP servers.

Claude Code reads skills and settings when a session starts, so changes apply to new sessions.

All file access happens in the Rust backend. The frontend only calls the exposed Tauri commands.

## Requirements

- Windows 10 or 11
- Node.js 20+
- Rust with the `stable-x86_64-pc-windows-msvc` toolchain
- Visual Studio Build Tools with "Desktop development with C++"

## Development

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

The MSI and NSIS installers end up in `src-tauri/target/release/bundle/`.

## License

[MIT](LICENSE)
