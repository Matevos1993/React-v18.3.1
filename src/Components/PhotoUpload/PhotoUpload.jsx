import React, { useState, useCallback, memo } from "react";

import "./PhotoUpload.scss";

const PhotoUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, []);

  const handleDeleteImage = useCallback(() => {
    setImage(null);
  }, []);

  return (
    <div className="upload-container">
      {image ? (
        <div className="image-wrapper">
          <img src={image} alt="Uploaded" className="image" loading="lazy" />
          <button
            className="delete-button"
            onClick={handleDeleteImage}
            aria-label="Delete image">
            &times;
          </button>
        </div>
      ) : (
        <label>
          <input
            type="file"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            accept="image/*"
            aria-label="Upload photo"
          />
          Upload Photo
        </label>
      )}
    </div>
  );
};

export default memo(PhotoUpload);
