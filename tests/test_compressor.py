import pytest
import tempfile
import shutil
from pathlib import Path
import sys
import types
import importlib


# Patch sys.argv for argparse in compressor.py
@pytest.fixture(autouse=True)
def patch_sys_argv(monkeypatch):
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "compressor.py",
            "--commit_hash",
            "abc123",
            "--repo_name",
            "myrepo",
            "--contributors_since",
            "5",
            "--whats_changed_url",
            "http://example.com/changes",
        ],
    )


@pytest.fixture
def compressor_module(monkeypatch):
    # Patch orjson to avoid import error if not installed
    fake_orjson = types.SimpleNamespace(
        dumps=lambda d, option=None: b"{}", OPT_INDENT_2=2, loads=lambda b: {}
    )
    monkeypatch.setitem(sys.modules, "orjson", fake_orjson)
    compressor = importlib.import_module("resources.compressor")
    return compressor


def test_setDefaultConfig_creates_file(tmp_path, compressor_module):
    config_path = tmp_path / "test_config.txt"
    compressor_module.setDefaultConfig(config_path)
    assert config_path.exists()
    content = config_path.read_text()
    assert "GitHub Workflow Composer Guide" in content


def test_readFileContent_reads_file(tmp_path, compressor_module):
    file_path = tmp_path / "file.txt"
    file_path.write_text("hello world", encoding="utf-8")
    result = compressor_module.readFileContent(file_path)
    assert result == "hello world"


def test_readFileContent_returns_none_for_missing(tmp_path, compressor_module):
    file_path = tmp_path / "missing.txt"
    result = compressor_module.readFileContent(file_path)
    assert result is None


def test_parseSettings_parses_title_desc_tag(compressor_module):
    config = """
    TITLE: My Title//ASYNC_END
    DESCRIPTION: My Description//ASYNC_END
    TAG: v1.0.0//ASYNC_END
    """
    title, desc, tag = compressor_module.parseSettings(config)
    assert title == "My Title"
    assert desc.strip() == "My Description"
    assert tag == "v1.0.0"


def test_parseSettings_multiline_desc(compressor_module):
    config = """
    TITLE: Title//ASYNC_END
    DESCRIPTION: Line1
    Line2
    //ASYNC_END
    TAG: tag//ASYNC_END
    """
    title, desc, tag = compressor_module.parseSettings(config)
    assert "Line1" in desc
    assert "Line2" in desc


def test_replacePlaceholders_replaces_all(monkeypatch, compressor_module):
    data = {
        "title": "Release ${COMMIT_HASH}",
        "description": "Repo: ${REPO_NAME}, Contributors: ${CONTRIBUTORS_SINCE}, URL: ${WHATS_CHANGED_URL}, Readme: ${README_MD}, Changelog: ${CHANGELOG_MD}",
        "tag": "v${COMMIT_HASH}",
    }

    # Patch args
    class Args:
        commit_hash = "abc123"
        repo_name = "myrepo"
        contributors_since = "5"
        whats_changed_url = "http://example.com/changes"

    monkeypatch.setattr(compressor_module, "args", Args)
    result = compressor_module.replacePlaceholders(
        data.copy(), README="README!", CHANGELOG="CHANGELOG!"
    )
    assert "abc123" in result["title"]
    assert "myrepo" in result["description"]
    assert "5" in result["description"]
    assert "http://example.com/changes" in result["description"]
    assert "README!" in result["description"]
    assert "CHANGELOG!" in result["description"]
    assert "abc123" in result["tag"]


def test_saveSchema_creates_json(tmp_path, monkeypatch, compressor_module):
    # Patch orjson.dumps to return bytes
    monkeypatch.setattr(
        compressor_module,
        "orjson",
        type(
            "FakeOrjson",
            (),
            {
                "dumps": staticmethod(lambda d, option=None: b'{"ok":true}'),
                "OPT_INDENT_2": 2,
            },
        ),
    )
    file_path = tmp_path / "schema.json"
    file_path.touch()
    data = {"a": 1}
    compressor_module.saveSchema(data, file_path)
    assert file_path.read_bytes() == b'{"ok":true}'


def test_saveSchema_prints_error_on_missing_path(tmp_path, capsys, compressor_module):
    file_path = tmp_path / "missing_dir" / "schema.json"
    data = {"a": 1}
    compressor_module.saveSchema(data, file_path)
    captured = capsys.readouterr()
    assert (
        "FATAL: Failed to write data as the path for this file doesn't exist"
        in captured.out
    )
