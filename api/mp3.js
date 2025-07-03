import Cookey from 'cookey';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ status: false, message: 'Método no permitido' });
    return;
  }

  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'Falta parámetro url' });

    const cookey = new Cookey();

    // Obtener info y audios
    const info = await cookey.videoInfo(url);
    const audios = await cookey.downloadAudio(url);

    if (!audios || audios.length === 0) {
      return res.status(404).json({ status: false, message: 'No se encontraron audios' });
    }

    // Mejor audio (mayor bitrate)
    let bestAudio = audios.reduce((prev, cur) => (prev.bitrate > cur.bitrate ? prev : cur));

    res.status(200).json({
      status: true,
      creator: 'Deylin',
      audio: {
        title: info.title,
        id: info.videoId,
        author: info.author.name,
        image: info.thumbnails[info.thumbnails.length - 1].url,
        views: info.viewCount,
        duration: info.lengthSeconds,
        download: {
          url: bestAudio.url,
          bitrate: bestAudio.bitrate,
          size: bestAudio.contentLength,
          extension: bestAudio.container,
        },
      },
    });
  } catch (error) {
    console.error('Error en /api/mp3:', error);
    res.status(500).json({ status: false, message: 'Error interno del servidor' });
  }
}