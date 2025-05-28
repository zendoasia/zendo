import argparse
import re
from pathlib import Path
from typing import TYPE_CHECKING

import orjson

if TYPE_CHECKING:
    from typing import Optional

parser = argparse.ArgumentParser()
parser.add_argument("--commit_hash", required=True)
parser.add_argument("--repo_name", required=True)
parser.add_argument("--contributors_since", required=True)
parser.add_argument("--whats_changed_url", required=True)

args = parser.parse_args()

_DEFAULT_COMPOSER_TEXT = """
# GitHub Workflow Composer Guide
# This compressor is used to automatically create a new release for your repository.
#
# You can use the following placeholders in the config:
# ${COMMIT_HASH}       - The commit hash of the release
# ${REPO_NAME}         - The name of the repository
# ${CONTRIBUTORS_SINCE} - Number of contributors since the last release
# ${WHATS_CHANGED_URL} - URL to the commit history for this release
# ${README_MD}         - Contents of README.md (auto-included)
# ${CHANGELOG_MD}      - Contents of CHANGELOG.md (auto-included)
#
# Important Notes:
# 1. All placeholders (e.g., ${COMMIT_HASH}) are case-sensitive.
# 2. Only one TITLE, DESCRIPTION, and TAG is allowed in the config.
# 3. Each section (TITLE, DESCRIPTION, TAG) must end with "//ASYNC_END".
#
# Example Configuration:
#
# TITLE: Release ${COMMIT_HASH}//ASYNC_END
# DESCRIPTION: Release Notes ${CHANGELOG_MD}//ASYNC_END
# TAG: v${COMMIT_HASH}//ASYNC_END

# Below is some config already set for you:

# IMPORTANT NOTE: TAG CANNOT HAVE SPACES

TITLE: Bedrock Community Release ${COMMIT_HASH}//ASYNC_END
DESCRIPTION: This is the latest release for the Bedrock Community bot with everything packed and ready to go. Here is a quick look of our readme:\n${README_MD}
``PLEASE NOTE:``
This is a automated release. Means no human is involved during release of this package.
COMMIT ID: ${COMMIT_HASH}
REPO: ${REPO_NAME}
WHAT'S CHANGED: ${WHATS_CHANGED_URL}//ASYNC_END
TAG: v${COMMIT_HASH}_AUTO//ASYNC_END
"""


def setDefaultConfig(qualifiedPath: Path) -> None:
    """Dump the default compressor configuration to a file"""
    with open(qualifiedPath, "w") as fw:
        fw.write(_DEFAULT_COMPOSER_TEXT)


def readFileContent(path: Path) -> "Optional[str]":
    """Safely load the content of a file, return None on failure"""
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        print(f"Failed to decode {path} with UTF-8, trying with 'latin-1'")
        with open(path, "r", encoding="latin-1") as f:
            return f.read()


def parseSettings(lineData: str):
    """Parse the settings from the compressor.settings.txt"""

    titleSettings, descSettings, tagSettings = "", "", ""

    title_pattern = re.compile(r"^TITLE:\s*(.*?)(//ASYNC_END)?$", re.IGNORECASE)
    desc_pattern = re.compile(r"^DESCRIPTION:\s*(.*?)(//ASYNC_END)?$", re.IGNORECASE)
    tag_pattern = re.compile(r"^TAG:\s*(.*?)(//ASYNC_END)?$", re.IGNORECASE)

    collecting_desc = False
    collecting_title = False
    collecting_tag = False

    for line in lineData.split("\n"):
        line = line.strip()

        if line.startswith(("#", "//")):
            continue

        if not collecting_title and title_pattern.match(line):
            titleSettings = title_pattern.match(line).group(1).strip()
            collecting_title = True
            if "//ASYNC_END" in line:
                collecting_title = False
            continue

        elif collecting_title:
            if "//ASYNC_END" in line:
                titleSettings += " " + line.split("//ASYNC_END")[0].strip()
                collecting_title = False
            else:
                titleSettings += " " + line.strip()
            continue

        if not collecting_desc and desc_pattern.match(line):
            descSettings = desc_pattern.match(line).group(1).strip() + "\n"
            collecting_desc = True
            if "//ASYNC_END" in line:
                collecting_desc = False
            continue

        elif collecting_desc:
            if "//ASYNC_END" in line:
                descSettings += line.split("//ASYNC_END")[0].strip() + "\n"
                collecting_desc = False
            else:
                descSettings += line.strip() + "\n"
            continue

        if not collecting_tag and tag_pattern.match(line):
            tagSettings = tag_pattern.match(line).group(1).strip()
            collecting_tag = True
            if "//ASYNC_END" in line:
                collecting_tag = False
            continue

        elif collecting_tag:
            if "//ASYNC_END" in line:
                tagSettings += " " + line.split("//ASYNC_END")[0].strip()
                collecting_tag = False
            else:
                tagSettings += " " + line.strip()
            continue

    descSettings = bytes(descSettings, "utf-8").decode("unicode_escape")
    titleSettings = bytes(titleSettings, "utf-8").decode("unicode_escape")
    tagSettings = bytes(tagSettings, "utf-8").decode("unicode_escape")

    return titleSettings, descSettings, tagSettings


def replacePlaceholders(dataDict: dict, README: str = None, CHANGELOG: str = None):
    """Replace placeholders in the data"""

    placeholders = {
        "${COMMIT_HASH}": args.commit_hash,
        "${REPO_NAME}": args.repo_name,
        "${CONTRIBUTORS_SINCE}": args.contributors_since,
        "${WHATS_CHANGED_URL}": args.whats_changed_url,
        "${README_MD}": README or "README.md file not found.",
        "${CHANGELOG_MD}": CHANGELOG or "CHANGELOG.md file not found.",
    }

    for key in dataDict:
        for placeholder, replacement in placeholders.items():
            dataDict[key] = re.sub(
                rf"\${{\s*{placeholder[2:-1]}\s*}}", replacement, dataDict[key]
            )

    return dataDict


def saveSchema(dataDict: dict, path: Path) -> None:
    """Save the schema to JSON"""
    if not path.exists():
        print(
            f"FATAL: Failed to write data as the path for this file doesn't exist: {path}"
        )
        return
    try:
        with open(path, "wb") as fsb:
            fsb.write(orjson.dumps(dataDict, option=orjson.OPT_INDENT_2))
    except Exception as e:
        print(f"FATAL: Failed to write to schema.json due to exception: {e}")


base = Path(__file__).parent.parent
compressor = base / "compressor.settings.txt"
temp = base / "temp"
temp.mkdir(parents=True, exist_ok=True)
schema = temp / "schema.json"
if not schema.exists():
    schema.touch(exist_ok=True)

data = readFileContent(compressor)

if data is None or not data.strip():
    print("Compressor settings file not found. Creating default config.")
    setDefaultConfig(compressor)
    data = _DEFAULT_COMPOSER_TEXT

titleSettings, descSettings, tagSettings = parseSettings(data)

if not all([titleSettings, descSettings, tagSettings]):
    print("No valid config found. Using default config.")
    setDefaultConfig(compressor)
    default_data = readFileContent(base / "resources" / "schema.json")
    d = orjson.loads(default_data) if default_data else {}
else:
    d = {
        "title": titleSettings.replace("//ASYNC_END", "").strip(),
        "description": descSettings.replace("//ASYNC_END", "").strip(),
        "tag": tagSettings.replace("//ASYNC_END", "").strip(),
    }

readmeContent = readFileContent(base / "README.md")
changelogContent = readFileContent(base / "CHANGELOG.md")

if any(content is None for content in [readmeContent, changelogContent]):
    for _ in range(3):
        print(
            f"FATAL: Failed to read either of readme.md or changelog.md. Either it doesn't exist or is corrupted."
        )

d = replacePlaceholders(d, readmeContent, changelogContent)

saveSchema(d, schema)
