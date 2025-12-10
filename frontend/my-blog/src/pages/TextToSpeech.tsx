import React from "react";

interface AudioPlayerProps {
  filename: string;
}

function AudioPlayer({ filename }: AudioPlayerProps) {
  return (
    <audio controls>
      <source src={`http://localhost:8001/stream-audio/${filename}`} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
}

export default AudioPlayer;
