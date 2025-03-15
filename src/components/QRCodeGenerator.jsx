
import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr_code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={qrRef} className="flex flex-col items-center p-4 bg-gray-100 rounded shadow">
      <QRCodeCanvas value={value} size={200} />
      <button onClick={downloadQRCode} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;
