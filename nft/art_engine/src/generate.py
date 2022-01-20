import os
import io
import json

if not os.path.exists('output/gif'):
    os.makedirs('output/gif')
if not os.path.exists('output/json'):
    os.makedirs('output/json')

MAX_LAYERS = 3
ANIMATIONS = ['standing', 'celebrating', 'pop_up', 'waving']  # first element is the default animation for the NFT
IPFS = 'ipfs://QmZQhumc4Kv97LC52Cu6uSyNUsPJa1fets926Msjx3ZNmt'
GIF_OUTPUT = 'output/gif/'
JSON_OUTPUT = 'output/json/'
LAYERS_CONFIG = {
    'Hat': [
        'NONE',
        'crown'
    ],
    'Chest': [
        'NONE',
        'hoodie'
    ],
    'Face': [
        'NONE',
        'sunglasses'
    ],
    'Hand': [
        'NONE',
        'watch'
    ]
}
LAYERS = [ l for l in LAYERS_CONFIG ]

# generate permutations of image layers, store into outputLayers
def permute(idx, count, curLayer, outputLayers):
    if count == MAX_LAYERS or idx == len(LAYERS_CONFIG):
        outputLayers.append(curLayer.copy())
        return
    for acc in LAYERS_CONFIG[LAYERS[idx]]:
        if acc == "NONE":
            permute(idx+1, count, curLayer, outputLayers)
        else:
            curLayer.append({
                'name': acc,
                'layer': LAYERS[idx]
            })
            permute(idx+1, count+1, curLayer, outputLayers)
            curLayer.pop()

# create a composite with all layers combined
def generateArtwork(outputIdx, outputLayer):
    print(outputLayer)
    for animation in ANIMATIONS:
        # Base animal case
        if (len(outputLayer) == 0):
            os.system(f'cp layers/Base/base_{animation}.gif {GIF_OUTPUT}{outputIdx}_{animation}.gif')
            continue

        # Combine first accessory with base animal
        layerPath = f'layers/{outputLayer[0]["layer"]}/{outputLayer[0]["name"]}_{animation}.gif'
        os.system(f'convert layers/Base/base_{animation}.gif -coalesce null:  \( {layerPath} \
            -coalesce -delete 4-8 \) \-layers composite -set delay 20 -loop \
            0 -layers optimize -delete 4-8 {GIF_OUTPUT}{outputIdx}_{animation}.gif')
        
        # Combine remaining
        i = 1
        while i < len(outputLayer):
            layerPath = f'layers/{outputLayer[i]["layer"]}/{outputLayer[i]["name"]}_{animation}.gif'
            os.system(f'convert {GIF_OUTPUT}{outputIdx}_{animation}.gif -coalesce null:  \( {layerPath} \
            -coalesce \) -layers composite -set delay 20 -loop 0 -layers optimize \
            -delete 4-8 {GIF_OUTPUT}{outputIdx}_{animation}.gif')
            i += 1

def generateMetadata(outputIdx, outputLayer):
    metadata = {
        'name': f'Pixel Pal #{outputIdx+1}',
        'description': 'Your digital companion',
        'image': f'{IPFS}/{outputIdx}_{ANIMATIONS[0]}.gif',
        'attributes': []
    }
    for layer in outputLayer:
        metadata['attributes'].append({
            'trait_type': layer['layer'],
            'value': layer['name']
        })
    for animation in ANIMATIONS:
        metadata[animation] = f'{IPFS}/{outputIdx}_{animation}.gif'
        
    with io.open(f'{JSON_OUTPUT}{outputIdx}.json', encoding='utf-8', mode='w+') as f:
        f.write(json.dumps(metadata, ensure_ascii=False))

outputLayers = []
permute(0, 0, [], outputLayers)
for outputIdx, outputLayer in enumerate(outputLayers):
    generateArtwork(outputIdx, outputLayer)
    generateMetadata(outputIdx, outputLayer)

    