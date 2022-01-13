import json
import os
import io

newIpfs='ipfs://QmZQhumc4Kv97LC52Cu6uSyNUsPJa1fets926Msjx3ZNmt'

for idx, data in enumerate(os.listdir(f'output/json')):
    f = open(f'output/json/{data}')
    metadata = json.load(f)
    f.close()
    metadata['image'] = f'{newIpfs}/{data[:-5]}.gif'
    with io.open(f'output/json/{data}', encoding='utf-8', mode='w+') as f:
        f.write(json.dumps(metadata, ensure_ascii=False))