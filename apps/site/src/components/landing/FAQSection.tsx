"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AccordionItem } from "@/components/ui/Accordion";
import type { FAQ, SiteContent } from "@/lib/types";

interface FAQSectionProps {
  faqs: FAQ[];
  content?: SiteContent | null;
}

const DEFAULT_FAQ_TITLE = "HAVE QUESTIONS THAT NEED ANSWER?";

export function FAQSection({ faqs, content }: FAQSectionProps) {
  const title = content?.title || DEFAULT_FAQ_TITLE;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="faq" className="relative py-14 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/faq-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/20" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-[32px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide md:mb-4 mb-2 flex flex-col items-center justify-center gap-0">
            <div className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 96 }}
                animate={inView ? { y: 0 } : { y: 96 }}
                transition={{
                  duration: 0.9,
                  ease: [0.77, 0, 0.175, 1],
                }}
              >
                {title}
              </motion.span>
            </div>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mt-4 md:mt-8"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
              variant="card"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
