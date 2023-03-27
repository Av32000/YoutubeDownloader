const { Innertube,UniversalCache,Utils } = require('youtubei.js');

async function Download(url, res){
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
    const id = url.split("v=")[1]
    let infos = await yt.getBasicInfo(id)
    let stream = await yt.download(id,{
        quality: 'best', 
        format: "mp4"
    })

    res.setHeader('Content-Disposition', 'attachment; filename=' + infos.basic_info.title + ".mp4");

    for await (const chunk of Utils.streamToIterable(stream)) {
        res.write(chunk);
    }

    res.end()
}

module.exports = {Download}