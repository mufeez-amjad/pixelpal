import os
import io
import json

if not os.path.exists('output/gif'):
    os.makedirs('output/gif')
if not os.path.exists('output/json'):
    os.makedirs('output/json')

ipfs = 'ipfs://QmZQhumc4Kv97LC52Cu6uSyNUsPJa1fets926Msjx3ZNmt'
output = "output/gif/output"
layers = [
    "Hat",
    "Tie",
]

accessoryList = {}
for layer in layers:
    accessoryList[layer] = ['NONE']
    for acc in os.listdir(f'layers/{layer}'):
        accessoryList[layer].append({
            'type': layer,
            'value': acc[:-4],
            'path': f'layers/{layer}/{acc}'
        })

outputLayers = []  


def permute(idx, curLayer):
    if idx == len(layers):
        outputLayers.append(curLayer.copy())
        return
    for acc in accessoryList[layers[idx]]:
        if acc == "NONE":
            permute(idx+1, curLayer)
        else:
            curLayer.append(acc)
            permute(idx+1, curLayer)
            curLayer.pop()

def generateArtwork(outputIdx, outputLayer):
    # Combine first accessory with base animal
    print(outputLayer)
    os.system(f'convert layers/Animal/corgi.gif -coalesce null:  \( {outputLayer[0]["path"]} \
        -coalesce -delete 4-8 \) \-layers composite -set delay 20 -loop \
        0 -layers optimize -delete 4-8 {output}{outputIdx}.gif')
    
    # Combine remaining
    i = 1
    while i < len(outputLayer):
        os.system(f'convert {output}{outputIdx}.gif -coalesce null:  \( {outputLayer[i]["path"]} \
        -coalesce \) -layers composite -set delay 20 -loop 0 -layers optimize \
        -delete 4-8 {output}{outputIdx}.gif')
        i += 1

def generateMetadata(outputIdx, outputLayer):
    metadata = {
        'name': f'Pixel Pal #{outputIdx+1}',
        'description': 'Your digital companion',
        'image': f'{ipfs}/output{outputIdx}.gif',
        'attributes': []
    }
    for layer in outputLayer:
        metadata['attributes'].append({
            'trait_type': layer['type'],
            'value': layer['value']
        })
        
    with io.open(f'output/json/{outputIdx}.json', encoding='utf-8', mode='w+') as f:
        f.write(json.dumps(metadata, ensure_ascii=False))

permute(0, [])
for outputIdx, outputLayer in enumerate(outputLayers):
    if len(outputLayer) == 0:   # base animal
        os.system(f'cp layers/Animal/corgi.gif {output}{outputIdx}.gif')
        generateMetadata(outputIdx, [])
    else:
        generateArtwork(outputIdx, outputLayer)
        generateMetadata(outputIdx, outputLayer)

    