import os

def fix_file(path):
    with open(path, 'r') as f:
        lines = f.readlines()
    
    # 1. Remove all dynamic declarations
    new_lines = [l for l in lines if 'export const dynamic =' not in l]
    
    # 2. Find if it has "use client"
    has_use_client = False
    use_client_idx = -1
    for i, line in enumerate(new_lines):
        if "'use client'" in line or '"use client"' in line:
            has_use_client = True
            use_client_idx = i
            break
            
    # 3. Add dynamic export in correct place
    dynamic_line = "export const dynamic = 'force-dynamic';\n"
    if has_use_client:
        new_lines.insert(use_client_idx + 1, dynamic_line)
    else:
        new_lines.insert(0, dynamic_line)
        
    # 4. Check for syntax balance (very basic but helps with truncated files)
    content = "".join(new_lines)
    open_braces = content.count('{')
    close_braces = content.count('}')
    
    if open_braces > close_braces:
        # Check if it looks like a typical Next.js route that got truncated
        # We'll just add the missing braces and hope for the best, or check for common endings
        missing = open_braces - close_braces
        content += "\n" + ("}" * missing) + "\n"
        print(f"Fixed braces in {path}: added {missing}")
    
    with open(path, 'w') as f:
        f.write(content)

# Process all relevant files
for root, dirs, files in os.walk('src/app'):
    for file in files:
        if file in ['page.tsx', 'layout.tsx', 'route.ts']:
            fix_file(os.path.join(root, file))
