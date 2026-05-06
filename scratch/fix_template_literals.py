import os
import re

def fix_template_literals(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to find '${API_URLS...}' or "${API_URLS...}" and replace with `${API_URLS...}`
    # We look for ' or " followed by ${API_URLS and then any characters until the matching ' or "
    
    # Case 1: Single quotes
    new_content = re.sub(r"'\$\{API_URLS\.([A-Z_]+)\}([^']*)'", r"`${API_URLS.\1}\2`", content)
    
    # Case 2: Double quotes
    new_content = re.sub(r"\"\$\{API_URLS\.([A-Z_]+)\}([^\\\"]*)\"", r"`${API_URLS.\1}\2`", new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed template literals in {file_path}")

def main():
    root_dir = "/Users/bytecode/.gemini/antigravity/scratch/Bytecode-Trainings/frontend/src"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                fix_template_literals(os.path.join(root, file))

if __name__ == "__main__":
    main()
