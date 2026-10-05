# scripts/parse_html_nodes.py
import re
import json

def parse_html_to_graph(html_content):
    nodes = []
    edges = []
    
    # We will parse hierarchy using regex / line scanning
    # Matches details summary or leaf
    # Patterns:
    # <details.*?class="(.*?)"><summary><span class="node-label">(.*?)</span>(?:<span class="count">(.*?)</span>)?</summary>
    # <div class="leaf (.*?)"><span class="node-label">(.*?)</span></div>
    lines = html_content.split('\n')
    stack = [] # (node_id, level)
    node_id_counter = 0

    for line in lines:
        line_s = line.strip()
        # Check details open
        details_match = re.search(r'<details\s+([^>]*class="([^"]*)")?[^>]*><summary><span class="node-label">(.*?)</span>(?:<span class="count">(.*?)</span>)?</summary>', line)
        leaf_match = re.search(r'<div class="leaf\s*([^"]*)"><span class="node-label">(.*?)</span></div>', line)
        
        if details_match:
            node_id_counter += 1
            node_id = f"node_{node_id_counter}"
            classes = details_match.group(2) or ""
            label = details_match.group(3)
            count = details_match.group(4) or "0"
            level_m = re.search(r'level-(\d+)', classes)
            level = int(level_m.group(1)) if level_m else len(stack)
            
            # Pop stack to parent level
            while stack and stack[-1]['level'] >= level:
                stack.pop()
                
            parent_id = stack[-1]['id'] if stack else None
            
            node = {
                "id": node_id,
                "label": label,
                "level": level,
                "count": int(count) if count.isdigit() else 0,
                "type": "root" if "root-node" in classes else "category",
                "isLeaf": False,
                "parentId": parent_id
            }
            nodes.append(node)
            if parent_id:
                edges.append({
                    "id": f"edge_{parent_id}_{node_id}",
                    "source": parent_id,
                    "target": node_id,
                    "type": "hierarchical",
                    "label": "subtopic"
                })
            stack.append({"id": node_id, "level": level})

        elif leaf_match:
            node_id_counter += 1
            node_id = f"node_{node_id_counter}"
            classes = leaf_match.group(1) or ""
            label = leaf_match.group(2)
            level_m = re.search(r'level-(\d+)', classes)
            level = int(level_m.group(1)) if level_m else (stack[-1]['level'] + 1 if stack else 1)
            
            parent_id = stack[-1]['id'] if stack else None
            node = {
                "id": node_id,
                "label": label,
                "level": level,
                "count": 0,
                "type": "concept",
                "isLeaf": True,
                "parentId": parent_id
            }
            nodes.append(node)
            if parent_id:
                edges.append({
                    "id": f"edge_{parent_id}_{node_id}",
                    "source": parent_id,
                    "target": node_id,
                    "type": "hierarchical",
                    "label": "leaf"
                })

        elif '</details>' in line:
            # We don't necessarily pop immediately on closing tag if indentation handles it,
            # but level matching handles hierarchy cleanly.
            pass

    return nodes, edges

print("Parser module loaded.")
