import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove glow shadows
content = re.sub(r'shadow-\[.*?\]', '', content)
content = re.sub(r'shadow-2xl', '', content)
content = re.sub(r'shadow-lg', '', content)
content = re.sub(r'shadow-md', '', content)
content = re.sub(r'drop-shadow-md', '', content)
content = re.sub(r'radar-pulse', '', content)
content = re.sub(r'box-shadow:.*?;', '', content)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all glows and shadows from public/index.html!")
