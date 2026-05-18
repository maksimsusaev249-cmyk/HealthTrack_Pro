import { Camera } from "react-camera-pro";
import { useRef, useState } from "react";

export default function CameraPage() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState(false);

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
  };

  const toggleFlash = async () => {
    const track = camera.current?.stream
      ?.getVideoTracks?.()[0];

    if (track) {
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flash }],
        });

        setFlash(!flash);
      }
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {!image && (
        <Camera
          ref={camera}
          facingMode="environment"
          aspectRatio={16 / 9}
        />
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={takePhoto}>
          Сделать фото
        </button>

        <button onClick={toggleFlash}>
          {flash ? "Выключить вспышку" : "Включить вспышку"}
        </button>

        <label>
          Выбрать фото
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            hidden
          />
        </label>
      </div>

      {image && (
        <img
          src={image}
          alt="preview"
          style={{ width: "100%", marginTop: 20 }}
        />
      )}
    </div>
  );
}