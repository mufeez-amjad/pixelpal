from multiprocessing.dummy import freeze_support
import os
import io
import json
import random
import subprocess
import pathlib
from multiprocessing import Pool, Value
from tqdm import tqdm

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
COMMAND = 'magick convert' if os.name == 'nt' else 'convert' # set up command depending on OS
counter = None # global counter

ANIMATION_CONFIG = {
    'standing': { 'last_frame': 3 },
    'celebrating': { 'last_frame': 3 },
    'waving': { 'last_frame': 1 },
    'pop_up': { 'last_frame': 5 },
}

# create a composite with all layers combined
def generateArtwork(outputIdx, outputLayer):
    '''
    Generate the NFT art with a background to be displayed on OpenSea
    '''

    for layer in outputLayer:
        if outputLayer[layer] == 0 and layer != 'background':
            continue # 0 = no accessory for layer
        animation = 'standing'
        selection = os.listdir(f'{CURRENT_DIR}/layers/{layer}')[outputLayer[layer]-1]
        path = f'{CURRENT_DIR}/layers/{layer}/{selection}/{animation}/{selection}_{animation}.gif'

        prev_output = f'{GIF_OUTPUT}{outputIdx}_nft.gif'
        if not os.path.exists(prev_output):
            prev_output = path

        cmd = f'{COMMAND} ( {prev_output} -coalesce ) null: ( {path} -coalesce ) -layers composite -set delay 20 -loop 0 -layers optimize -delete 4-8 {CURRENT_DIR}/{GIF_OUTPUT}{outputIdx}_nft.gif'
        subprocess.run(cmd.split())

    '''
    Generate the animations used in the app
    '''

    for animation in ANIMATIONS:
        for layer in outputLayer:
            if layer == 'background' or outputLayer[layer] == 0:
                continue
            
            selection = os.listdir(f'{CURRENT_DIR}/layers/{layer}')[outputLayer[layer]-1]
            path = f'{CURRENT_DIR}/layers/{layer}/{selection}/{animation}/{selection}_{animation}.gif'

            prev_output = f'{CURRENT_DIR}/{GIF_OUTPUT}{outputIdx}_{animation}.gif'
            if not os.path.exists(prev_output):
                prev_output = f'{CURRENT_DIR}/layers/base/base/{animation}/base_{animation}.gif'

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

def generateWithLayers(outputLayer):
    global counter
    outputIdx = 0
    with counter.get_lock():
        outputIdx = counter.value
        counter.value += 1
    
    generateArtwork(outputIdx, outputLayer)
    generateMetadata(outputIdx, outputLayer)

outputLayers = [
    { 'background': random.randint(0, LAYERS_CONFIG['background']-1), 'base': 1, 'head': head_idx, 'body': body_idx, 'face': face_idx, 'hand': hand_idx } \
        for head_idx in range(LAYERS_CONFIG['head']) \
        for body_idx in range(LAYERS_CONFIG['body']) \
        for face_idx in range(LAYERS_CONFIG['face']) \
        for hand_idx in range(LAYERS_CONFIG['hand']) \
]

random.shuffle(outputLayers)

def init_globals(c):
    global counter
    counter = c

if __name__ == '__main__':
    freeze_support()
    counter = Value('i', 0)
    with Pool(initializer=init_globals, initargs=(counter,)) as p:
        list(tqdm(p.imap(generateWithLayers, outputLayers), total=len(outputLayers)))
    