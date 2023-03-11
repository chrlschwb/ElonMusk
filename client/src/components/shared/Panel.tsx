import React from 'react';

interface Pros {
  url: string;
}

function Panel({ url }: Pros) {
  return (
    <div className="panel_background justify-center align-middle flex items-center">
      <img src={url} alt="image data" style={{ height: '-webkit-fill-available' }} />
    </div>
  );
}

export default Panel;
