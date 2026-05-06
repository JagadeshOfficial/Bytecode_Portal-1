import os
import re

# Configuration
SEARCH_REPLACEMENTS = {
    'http://localhost:8080': '`${API_URLS.LMS_BACKEND}`',
    'http://localhost:8085': '`${API_URLS.MASTER_BACKEND}`',
    'http://localhost:5001': '`${API_URLS.B_EMS_BACKEND}`',
}

# Also handle cases where it's part of a template literal already
TEMPLATE_REPLACEMENTS = {
    'http://localhost:8080': '${API_URLS.LMS_BACKEND}',
    'http://localhost:8085': '${API_URLS.MASTER_BACKEND}',
    'http://localhost:5001': '${API_URLS.B_EMS_BACKEND}',
}

IMPORT_STATEMENT = "import { API_URLS } from '@/lib/api-config';\n"

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    modified = False

    # Check if we need to replace anything
    has_localhost = any(url in content for url in SEARCH_REPLACEMENTS.keys())
    
    if not has_localhost:
        return

    # Replace hardcoded strings
    # We need to be careful with template literals.
    # If the URL is already inside ``, we use TEMPLATE_REPLACEMENTS
    # If it's inside '', we use SEARCH_REPLACEMENTS (which adds ``)
    
    for url, replacement in SEARCH_REPLACEMENTS.items():
        # Case 1: 'http://localhost:8080' or "http://localhost:8080"
        new_content = re.sub(f"(['\"]){url}(['\"])", replacement, new_content)
        
        # Case 2: `http://localhost:8080`
        new_content = re.sub(f"(`){url}(`)", replacement, new_content)

        # Case 3: Inside an existing template literal `http://localhost:8080/api...`
        new_content = new_content.replace(url, TEMPLATE_REPLACEMENTS[url])

    if new_content != content:
        modified = True
        # Add import if not present
        if "API_URLS" not in new_content:
            # Insert after the first "use client" or at the top
            if '"use client"' in new_content or "'use client'" in new_content:
                new_content = re.sub(r'("use client"|\'use client\');?', r'\1;\n' + IMPORT_STATEMENT, new_content)
            else:
                new_content = IMPORT_STATEMENT + new_content

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

def main():
    root_dir = "/Users/bytecode/.gemini/antigravity/scratch/Bytecode-Trainings/frontend/src"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
