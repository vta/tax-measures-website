import { Slide } from 'react-slideshow-image';

export const Slideshow = ({ data }) => {
  console.log(data.images);
  return (
    <Slide
      autoplay={false}
      onChange={function noRefCheck() {}}
      onStartChange={function noRefCheck() {}}
    >
      {data.images.map((image) => (
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
