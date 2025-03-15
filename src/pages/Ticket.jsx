
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function ManualTicket() {
  const { registrationId } = useParams();
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Helper function to wrap text on canvas.
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    return y;
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/registrations/${registrationId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Ticket not found');
        }
        const data = await res.json();
        setTicketInfo(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchTicket();
  }, [registrationId]);

  useEffect(() => {
    if (ticketInfo && canvasRef.current) {
      drawTicketOnCanvas();
    }
  }, [ticketInfo]);

  const drawTicketOnCanvas = () => {
    const { registration, event } = ticketInfo;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const width = 1000;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Fill background white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw header with gradient background
    const headerHeight = 80;
    const headerGradient = ctx.createLinearGradient(0, 0, width, 0);
    headerGradient.addColorStop(0, '#4f46e5'); // Indigo-500
    headerGradient.addColorStop(1, '#9333ea'); // Purple-600
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, width, headerHeight);

    // Header title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Your Event Ticket', width / 2, 50);

    // Divider line
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, headerHeight + 10);
    ctx.lineTo(width - 50, headerHeight + 10);
    ctx.stroke();

    // Draw Event Title (centered below header)
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(event.title, width / 2, headerHeight + 50);

    // Draw event description below title using wrapText.
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    const descriptionX = 50;
    let descriptionY = headerHeight + 80;
    const maxDescriptionWidth = width - 300; // leave room on right for QR code
    const lineHeight = 22;
    

    // Leave a gap after description before event details.
    let detailsY = descriptionY + 30;

    // Draw event details on left side
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText(`Date: ${new Date(event.date).toLocaleString()}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(`Location: ${event.location}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(`Category: ${event.category}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(`Organizer: ${event.organizer}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(`Contact: ${event.organizerContact}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(
      `Registration: ${new Date(event.registrationStartDate).toLocaleString()} - ${new Date(event.registrationEndDate).toLocaleString()}`,
      50,
      detailsY
    );
    detailsY += lineHeight * 1.5;

    // Draw participant details below event details
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText(`Participant: ${registration.user}`, 50, detailsY);
    detailsY += lineHeight;
    ctx.fillText(`Ticket ID: ${registration._id}`, 50, detailsY);

    // Draw QR code image on the right side
    if (registration.qrCodeData) {
      const qrImg = new Image();
      qrImg.onload = () => {
        const qrSize = 200;
        const qrX = width - qrSize - 50; // 50px from right edge
        const qrY = headerHeight + 80; // align with description top
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      };
      qrImg.src = registration.qrCodeData;
    }
  };

  const downloadTicket = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Ticket_${registrationId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }
  if (!ticketInfo) {
    return <div className="p-6 text-center text-gray-600">Loading Ticket...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <canvas ref={canvasRef} className="mb-6" style={{ border: 'none' }} />
      <button
        onClick={downloadTicket}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition text-white font-bold rounded-md "
      >
        Download Ticket
      </button>
    </div>
  );
}

export default ManualTicket;
