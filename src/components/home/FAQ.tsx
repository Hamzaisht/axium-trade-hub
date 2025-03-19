
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What are Creator-Linked Tokens (CLTs)?",
    answer: "Creator-Linked Tokens (CLTs) are digital assets that represent a financial stake in a creator's brand value and future success. Similar to stocks, these tokens can be bought, sold, and traded on the Axium.io platform, with prices fluctuating based on the creator's performance metrics, social engagement, and market demand."
  },
  {
    question: "How are token prices determined?",
    answer: "Token prices are determined by our proprietary AI valuation model that analyzes real-time data from multiple sources including social media engagement, streaming figures, brand partnerships, and overall market sentiment. Our algorithms combine these factors to establish a fair market value that updates in real-time."
  },
  {
    question: "Is this considered a security or investment?",
    answer: "Axium.io operates in compliance with relevant regulations in each jurisdiction. In some regions, CLTs may be classified as digital assets rather than securities. We recommend consulting with a financial advisor about the specific regulatory classification in your region before investing."
  },
  {
    question: "How do creators benefit from launching their tokens?",
    answer: "Creators benefit by establishing a new revenue stream and by deepening connections with their most loyal fans. They receive a percentage of the initial token sale and can earn from secondary market transactions. Additionally, tokens create powerful incentives that align creator and fan interests over the long term."
  },
  {
    question: "What blockchain technology does Axium.io use?",
    answer: "Axium.io utilizes Ethereum Layer 2 solutions and Solana for lower transaction fees and faster processing times. All transactions are secured by smart contracts that ensure transparency and security while maintaining the efficiency needed for a real-time trading platform."
  },
  {
    question: "Are there any fees for trading on the platform?",
    answer: "Yes, Axium.io charges a small transaction fee for each trade (typically 1-2% depending on the transaction size). There may also be network fees associated with blockchain transactions, though we optimize these to be as minimal as possible through our Layer 2 implementation."
  }
];

export const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const handleAccordionChange = (value: string) => {
    setExpandedItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-axium-blue/10 text-axium-blue rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-axium-gray-900 mb-4">
            Everything you need to know about <span className="text-gradient-blue">Axium.io</span>
          </h2>
          <p className="text-axium-gray-600 max-w-2xl mx-auto text-lg">
            Get answers to the most common questions about our platform, 
            creator tokens, and how our AI-powered valuation system works.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <GlassCard className="overflow-visible">
            <Accordion 
              type="multiple" 
              value={expandedItems}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className={cn(
                    "border border-axium-gray-200 rounded-lg px-6 py-1.5 overflow-hidden",
                    expandedItems.includes(`item-${index}`) 
                      ? "shadow-glass-blue bg-axium-blue/[0.02]" 
                      : "shadow-button bg-white"
                  )}
                >
                  <AccordionTrigger 
                    onClick={() => handleAccordionChange(`item-${index}`)}
                    className={cn(
                      "text-left font-medium py-4 hover:no-underline transition-colors",
                      expandedItems.includes(`item-${index}`) 
                        ? "text-axium-blue"
                        : "text-axium-gray-800"
                    )}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-axium-gray-600 pt-1 pb-4 leading-relaxed text-balance">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
