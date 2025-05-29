import os
import tempfile
import base64
import orjson
import pytest
from resources import parse


def test_sanitize_string():
    assert parse.sanitize_string("  hello  ") == "hello"
    assert parse.sanitize_string("\nworld\t") == "world"
    assert parse.sanitize_string("") == ""


def test_main_writes_expected_output(monkeypatch):
    # Prepare test schema.json
    schema = {
        "title": "  Test Release  ",
        "description": "This is a test description.",
        "tag": "  v1.0.0  ",
    }
    with tempfile.TemporaryDirectory() as tempdir:
        schema_path = os.path.join(tempdir, "schema.json")
        with open(schema_path, "wb") as f:
            f.write(orjson.dumps(schema))

        # Prepare output file
        output_path = os.path.join(tempdir, "output.txt")
        monkeypatch.setenv("GITHUB_OUTPUT", output_path)

        # Patch the open path in parse.py to use our schema file
        orig_open = parse.open

        def open_patch(path, mode="r", *args, **kwargs):
            if path == "./temp/schema.json":
                return orig_open(schema_path, mode, *args, **kwargs)
            return orig_open(path, mode, *args, **kwargs)

        monkeypatch.setattr(parse, "open", open_patch)

        parse.main()

        with open(output_path, "r") as f:
            lines = f.read().splitlines()
            assert lines[0] == "release_title=Test Release"
            expected_b64 = base64.b64encode(
                schema["description"].encode("utf-8")
            ).decode("utf-8")
            assert lines[1] == f"release_description_b64={expected_b64}"
            assert lines[2] == "release_tag=v1.0.0"
