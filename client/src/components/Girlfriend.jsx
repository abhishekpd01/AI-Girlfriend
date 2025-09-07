import '../gf.css'
import Dictaphone from './Dictaphone';
const Girlfriend = (props) => {
    // Remove 'gf_' from the image filename and change extension to .png
    const imageUrl = props.image
    ? props.image.replace(/gf_/, '').replace(/\.jpg$/, '.png')
    : '';

    return (
        <div className="image-container">
            <div
            className="gf"
            style={{ backgroundImage: `url(${imageUrl})` }}
            onClick={() => {
                if (typeof props?.onSelectImage === 'function') {
                props.onSelectImage(imageUrl);
                }
            }}
            ></div>
            <div className="mic-container">
                <Dictaphone />
            </div>
        </div>
    );

}

export default Girlfriend;