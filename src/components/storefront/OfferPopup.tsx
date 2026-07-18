'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Check, Flame, Sparkles } from 'lucide-react';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';

const STORAGE_KEY = 'zenyfit-offer-dismissed';
const { offerPopup } = ZENYFIT_CONFIG;

function shouldShow(): boolean {
  if (!offerPopup.active) return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  try {
    const dismissedAt = new Date(raw).getTime();
    const cooldownMs = offerPopup.cooldownHours * 60 * 60 * 1000;
    return Date.now() - dismissedAt > cooldownMs;
  } catch {
    return true;
  }
}

export default function OfferPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShow()) setShow(true);
    }, 2500); // aparece 2.5s depois da página carregar
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  }, []);

  const handleCta = () => {
    dismiss();
    const link = offerPopup.ctaLink;
    if (link.startsWith('#')) {
      const el = document.querySelector(link);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = link;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={dismiss}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden"
          >
            {/* Urgency banner */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-5 py-2.5 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-white/90" />
              <span className="text-sm font-semibold text-white tracking-wide">
                {offerPopup.urgencyLabel}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-7">
              {/* Title */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Promoção</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {offerPopup.title}
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-gray-600 text-center mb-5 leading-relaxed">
                {offerPopup.subtitle}
              </p>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                  Por que escolher a ZenyFit:
                </p>
                <ul className="space-y-2">
                  {offerPopup.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-zeny-green" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock alert */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2.5 mb-5">
                <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-orange-800">
                  {offerPopup.stockAlert}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCta}
                className="w-full bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full py-4 text-base font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-zeny-green/25"
              >
                {offerPopup.ctaText}
                <span className="text-lg">&rarr;</span>
              </button>

              {/* Footer */}
              <p className="text-center text-xs text-gray-400 mt-3">
                {offerPopup.footerText}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}