import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ChartQRCodeProps {
  url: string;
}

const ChartQRCode: React.FC<ChartQRCodeProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-8 mb-4">
      <QRCodeSVG value={url} size={160} level="M" bgColor="transparent" />
    </div>
  );
};

export default ChartQRCode;
