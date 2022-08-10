import Image from '../models/image';

class ImageController {
  async show(req, res) {
    const image = await Image.scope('withData').findByPk(req.params.image_id);

    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    if (image.data == null) {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    const base64Data = image.data.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ''
    );

    if (base64Data == ' ') {
      return res.status(404).json({ message: 'Imagem não encontrada' });
    }

    const data = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': data.length,
    });

    return res.end(data);
  }
}

export default new ImageController();
