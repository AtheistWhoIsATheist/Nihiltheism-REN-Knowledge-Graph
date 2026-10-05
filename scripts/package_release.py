import os
import zipfile

output_zip = 'nihiltheism-ren-knowledge-graph-final.zip'
if os.path.exists(output_zip):
    os.remove(output_zip)

files_to_include = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'server.ts',
    'index.html',
    'metadata.json',
    '.env.example',
    '.gitignore',
    'nihiltheism-ren-knowledge-graph.html',
    'README.md',
    'start.sh',
    'start.bat',
    'start.ps1',
    'bun.lock'
]

dirs_to_include = [
    'src',
    'tests'
]

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in files_to_include:
        if os.path.exists(f):
            print(f"Adding file: {f}")
            zipf.write(f, arcname=f)
        else:
            print(f"Warning: {f} does not exist")
            
    for d in dirs_to_include:
        for root, _, filenames in os.walk(d):
            for filename in filenames:
                if filename.endswith('.pyc') or filename == '.DS_Store':
                    continue
                filepath = os.path.join(root, filename)
                print(f"Adding dir file: {filepath}")
                zipf.write(filepath, arcname=filepath)

print(f"\nSuccessfully created {output_zip} (Size: {os.path.getsize(output_zip)} bytes)")
