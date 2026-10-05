# scripts/packager.py
import zipfile
import os
import sys

def make_zip(source_dir, output_zip):
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, source_dir)
                zipf.write(full_path, rel_path)
    print(f"Archive created at: {output_zip} ({os.path.getsize(output_zip)} bytes)")

def extract_zip(zip_path, extract_dir):
    with zipfile.ZipFile(zip_path, "r") as zipf:
        zipf.extractall(extract_dir)
    print(f"Extracted to: {extract_dir}")

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'zip':
        make_zip(sys.argv[2], sys.argv[3])
    elif mode == 'unzip':
        extract_zip(sys.argv[2], sys.argv[3])
