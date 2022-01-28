import os
import io
import json
import random
import pdb # remove
import subprocess
import pathlib

if not os.path.exists('output/gif'):
    os.makedirs('output/gif')
if not os.path.exists('output/json'):
    os.makedirs('output/json')

NUM_BACKGROUNDS = 6
MAX_LAYERS = 3
ANIMATIONS = ['standing', 'celebrating', 'pop_up', 'waving']  # first element is the default animation for the NFT image
IPFS = 'ipfs://QmZQhumc4Kv97LC52Cu6uSyNUsPJa1fets926Msjx3ZNmt'
GIF_OUTPUT = 'output/gif/'
JSON_OUTPUT = 'output/json/'
CURRENT_DIR = os.path.dirname(pathlib.Path(__file__).parent.resolve())
LAYERS = [ 'background', 'base', 'head', 'body', 'face', 'hand' ]
LAYERS_CONFIG = { layer: len(os.listdir(f'{CURRENT_DIR}/layers/{layer}')) + 1 for layer in LAYERS }

ANIMATION_CONFIG = {
    'standing': { 'last_frame': 3 },
    'celebrating': { 'last_frame': 3 },
    'waving': { 'last_frame': 1 },
    'pop_up': { 'last_frame': 5 },
}

COMMAND = 'magick convert' if os.name == 'nt' else 'convert' # set up command depending on OS

# create a composite with all layers combined
def generateArtwork(outputIdx, outputLayer):
    print(outputLayer)

    '''
    Generate the NFT art with a background to be displayed on OpenSea
    '''

    for i, layer in enumerate(outputLayer):
        if outputLayer[layer] == 0:
            continue # 0 = no accessory for layer
        animation = 'standing'
        selection = os.listdir(f'{CURRENT_DIR}/layers/{layer}')[outputLayer[layer]-1]
        path = f'{CURRENT_DIR}/layers/{layer}/{selection}/{animation}/{selection}_{animation}.gif'
        prev_output = path if i == 0 else f'{GIF_OUTPUT}{outputIdx}_nft.gif'

        cmd = f'{COMMAND} ( {prev_output} -coalesce ) null: ( {path} -coalesce ) -layers composite -set delay 20 -loop 0 -layers optimize -delete 4-8 {CURRENT_DIR}/{GIF_OUTPUT}{outputIdx}_nft.gif'
        print(cmd)
        subprocess.run(cmd.split())

    '''
    Generate the animations used in the app
    '''

    for animation in ANIMATIONS:
        for i, layer in enumerate(outputLayer):
            if layer == 'background' or outputLayer[layer] == 0:
                continue
            
            selection = os.listdir(f'{CURRENT_DIR}/layers/{layer}')[outputLayer[layer]-1]
            path = f'{CURRENT_DIR}/layers/{layer}/{selection}/{animation}/{selection}_{animation}.gif'
            prev_output = f'{CURRENT_DIR}/layers/base/{animation}/base_{animation}.gif' if i == 0 else f'{CURRENT_DIR}/{GIF_OUTPUT}{outputIdx}_{animation}.gif'
            last_frame = ANIMATION_CONFIG[animation]['last_frame']

            cmd = f'{COMMAND} ( {prev_output} -coalesce ) null: ( {path} -coalesce ) -layers composite -set delay 20 -loop 0 -layers optimize -delete {last_frame+1}-8 {CURRENT_DIR}/{GIF_OUTPUT}{outputIdx}_{animation}.gif'        
            subprocess.run(cmd.split())

def generateMetadata(outputIdx, outputLayer):
    metadata = {
        'name': f'Pixel Pal #{outputIdx+1}',
        'description': 'Your digital companion',
        'image': f'{IPFS}/{outputIdx}_nft.gif',
        'attributes': []
    }

    for layer in outputLayer:
        selection = os.listdir(f'./layers/{layer}')[outputLayer[layer]-1]
        metadata['attributes'].append({
            'trait_type': layer.capitalize(),
            'value': selection.capitalize()
        })
    for animation in ANIMATIONS:
        metadata[animation] = f'{IPFS}/{outputIdx}_{animation}.gif'
        
    with io.open(f'{JSON_OUTPUT}{outputIdx}.json', encoding='utf-8', mode='w+') as f:
        f.write(json.dumps(metadata, ensure_ascii=False))

outputLayers = [
    { 'background': bg_idx, 'base': 1, 'head': head_idx, 'body': body_idx, 'face': face_idx, 'hand': hand_idx } \
        for bg_idx in range(LAYERS_CONFIG['background']) \
        for head_idx in range(LAYERS_CONFIG['head']) \
        for body_idx in range(LAYERS_CONFIG['body']) \
        for face_idx in range(LAYERS_CONFIG['face']) \
        for hand_idx in range(LAYERS_CONFIG['hand']) \
]

random.shuffle(outputLayers)

for outputIdx, outputLayer in enumerate(outputLayers):
    generateArtwork(outputIdx, outputLayer)
    generateMetadata(outputIdx, outputLayer)

    