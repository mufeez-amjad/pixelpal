import os

output = "output/output"
layers = [
    "Hat",
    "Tie",
]

accessoryList = {}
for layer in layers:
    accessoryList[layer] = ['NONE']
    for acc in os.listdir(f'layers/{layer}'):
        accessoryList[layer].append(f'layers/{layer}/{acc}')

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

permute(0, [])

for outputIdx, outputLayer in enumerate(outputLayers):
    if len(outputLayer) == 0:
        os.system(f'cp layers/Animal/corgi.gif output/output{outputIdx}.gif')
    else:
        # Combine first accessory with base animal
        os.system(f'convert layers/Animal/corgi.gif -coalesce null:  \( {outputLayer[0]} \
            -coalesce -delete 4-8 \) \-layers composite -set delay 20 -loop \
            0 -layers optimize -delete 4-8 {output}{outputIdx}.gif')
        
        # Combine remaining
        i = 1
        while i < len(outputLayer):
            os.system(f'convert {output}{outputIdx}.gif -coalesce null:  \( {outputLayer[i]} \
            -coalesce \) -layers composite -set delay 20 -loop 0 -layers optimize \
            -delete 4-8 {output}{outputIdx}.gif')
            i += 1
    