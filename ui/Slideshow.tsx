import { Slide } from 'react-slideshow-image';

export const Slideshow = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Slide
      autoplay={false}
      onChange={function noRefCheck() {}}
      onStartChange={function noRefCheck() {}}
    >
      {images.map((image) => (
        <div className="each-slide-effect">
          <div
            style={{
              backgroundImage: `url(${image.fields.URL})`,
            }}
          >
            <div className="caption">{image.fields.Caption}</div>
          </div>
        </div>
      ))}
    </Slide>
  );
};
