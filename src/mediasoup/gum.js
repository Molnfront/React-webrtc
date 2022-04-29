const DEFAULT_CONSTRAINTS = Object.freeze({
  audio: true,
  video: { facingMode: "environment" }
});

// Gets the users camera and returns the media stream
export const GUM = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS);
  } catch (error) {
    console.error(error);
  }
};
