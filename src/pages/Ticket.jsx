import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Calendar, MapPin, ArrowLeft, Loader2, Sparkles, ShieldCheck, QrCode } from 'lucide-react';

function ManualTicket() {
  const { registrationId } = useParams();
  const [ticketInfo, setTicketInfo] = useState(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const canvasRef = useRef(null);

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
        const res = await fetch(`https://event-backend-utqn.onrender.com/api/registrations/${registrationId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Ticket not found');
        }
        const data = await res.json();
        setTicketInfo(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsGenerating(false);
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

    const width = 1000;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Gradient Edge
    const grad = ctx.createLinearGradient(0, 0, 10, height);
    grad.addColorStop(0, '#ff385c');
    grad.addColorStop(1, '#ff8a00');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 10, height);

    // Text Styles
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ENTRY PASS', 60, 80);

    ctx.fillStyle = '#ff385c';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFFICIAL EVENTS TICKET', 60, 110);

    // Event Info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic bold 64px sans-serif';
    ctx.fillText(event.title.toUpperCase(), 60, 200);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#666666';
    ctx.fillText(event.location.toUpperCase(), 60, 240);

    // Details Grid
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#444444';
    ctx.fillText('PASSENGER', 60, 320);
    ctx.fillText('DATE', 300, 320);
    ctx.fillText('CATEGORY', 540, 320);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(registration.fullName || registration.user, 60, 350);
    ctx.fillText(new Date(event.date).toLocaleDateString(), 300, 350);
    ctx.fillText(event.category.toUpperCase(), 540, 350);

    // Border Lines
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(650, 280);
    ctx.stroke();

    // QR Code Section Background
    ctx.fillStyle = '#111111';
    ctx.fillRect(700, 0, 300, height);

    // Draw QR code image
    if (registration.qrCodeData) {
      const qrImg = new Image();
      qrImg.onload = () => {
        const qrSize = 180;
        const qrX = 760;
        const qrY = 160;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        
        ctx.fillStyle = '#444444';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN FOR ENTRY', 850, 380);
        ctx.fillText(registration._id.slice(-12).toUpperCase(), 850, 400);
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
    link.download = `Pass_${registrationId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Error Retrieving Ticket</h2>
        <p className="text-red-400 mb-6 font-bold">{error}</p>
        <Link to="/dashboard" className="btn-primary">Back to Hub</Link>
      </div>
    </div>
  );

  if (isGenerating) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <Loader2 className="text-[#ff385c]" size={48} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Link to="/dashboard" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-6 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2 text-[#ff385c] mb-4">
              <QrCode size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Boarding Pass</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Your <br />
              <span className="text-gradient">Ticket.</span>
            </h1>
          </div>

          <button
            onClick={downloadTicket}
            className="btn-primary flex items-center space-x-3 px-10 py-5 text-lg uppercase italic tracking-tighter font-black"
          >
            <Download size={24} />
            <span>Download Pass</span>
          </button>
        </div>

        {/* Ticket Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer"
          onClick={downloadTicket}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff385c] to-[#ff8a00] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <canvas 
            ref={canvasRef} 
            className="w-full h-auto rounded-[2.5rem] shadow-2xl border border-white/5 relative z-10" 
            style={{ maxWidth: '1000px' }}
          />
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-500 font-bold uppercase tracking-widest text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Verified District Pass</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-[#ff385c]" />
              <span>Premium Entry</span>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <div className="mt-12 glass rounded-[3rem] p-10 border-white/10 grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-[#ff385c] mb-6">Entry Instructions</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium leading-relaxed">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff385c] mt-2"></div>
                <span>Present this digital pass at the entrance gate.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff385c] mt-2"></div>
                <span>Ensure your QR code is clearly visible and brightness is up.</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff385c] mt-2"></div>
                <span>Valid ID matching the passenger name may be required.</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5 w-full">
              <MapPin className="mx-auto text-[#ff385c] mb-4" size={32} />
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Venue Destination</div>
              <div className="font-bold text-white uppercase italic tracking-tight">{ticketInfo.event.location}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualTicket;
