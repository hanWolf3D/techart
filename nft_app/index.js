const sharp = require('sharp')

// a x y coord, which defines pivot position on the mask
// TODO change top left offset to be relative

async function placeImage() {
    try {
        // prep source image
        const offset_source_img = await sharp("source_nft.png")
        .resize({
            width: 200,
            height: 150
          })
        .ensureAlpha()
        .rotate(45, { background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .toBuffer();
        
        // TODO ensure scale relative nft to mask remains same when scaling mask
        // if we scale mask up, we need to scale nft also up!

        // scale mask to texture
        var mask_img = await sharp("source_mask.png")
        .resize({
            width: 600,
            height: 600
            })
        .toBuffer();
        
        // change mask from a black and white RGB to RGBA
        mask_img = await sharp(mask_img)
        .joinChannel(mask_img)
        .toBuffer();
        
        // get width and height from offset_source_img
        const metadata = await sharp(offset_source_img).metadata();
        const x_offset = parseInt(metadata.width/2);
        const y_offset = parseInt(metadata.height/2);

        // TODO this should be read from config file
        const x_center = 425;
        const y_center = 175;

        const x = x_center - x_offset;
        const y = y_center - y_offset;

        // mask offset nft with the mask
        const masked_nft_img = await sharp(mask_img)
        .composite([
            { input: offset_source_img, left: x, top: y, blend: 'in' }
        ])
        .toBuffer();

        // resizee texture to mask
        const resized_texture_img = await sharp("source_texture.jpg")
        .resize({
            width: 600,
            height: 600
            })
        .ensureAlpha()
        .composite([
            { input: masked_nft_img, blend: 'over' },
        ])
        .removeAlpha()
        .toFile("output_combined_texture.png");
            
    } catch (error) {
      console.log(error);
    }
  }
  
  placeImage();