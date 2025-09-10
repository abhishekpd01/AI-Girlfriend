import fs from 'fs';

function clearAudio(req, res) {
    const { path } = req.query;
    
    if(!path) {
        return res.status(400).json({ error: "No file path" })
    }
    const filePath = `./public${path}`
    console.log("Deleting file:", filePath);
    fs.unlink(filePath, (err) => {
        if(err) {
            console.error('Error deleting file:', err)
        }
        return res.status(200).json({ message: 'File successfully deleted!' })
    })
}

export default clearAudio