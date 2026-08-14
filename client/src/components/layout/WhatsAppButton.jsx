import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { whatsaapLink } from '../../lib/utils';

export default function WhatsAppButton() {
  const { settings } = useSite();
  const href = whatsaapLink(settings.whatsappNumber, 'Hello, I would like to enquire about your upholstery services.');

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-colors hover:bg-[#1fb457] sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={26} fill="currentColor" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </motion.a>
  );
}
