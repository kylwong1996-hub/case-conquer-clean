import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CaseForesight?",
    answer: "CaseForesight is an interactive platform designed to help you master consulting case interviews. Practice with realistic cases, get AI-powered feedback, and track your progress as you prepare for interviews at top consulting firms."
  },
  {
    question: "How does the AI feedback work?",
    answer: "Our AI analyzes your responses in real-time, evaluating your structure, logic, and communication. You'll receive detailed scores and actionable suggestions to improve your case-solving skills."
  },
  {
    question: "What types of cases are available?",
    answer: "We offer a comprehensive library covering market sizing, profitability, market entry, M&A, operations, and more. Cases range from beginner to advanced difficulty levels."
  },
  {
    question: "Can I practice with voice responses?",
    answer: "Yes! CaseForesight supports voice-to-text functionality, allowing you to practice answering cases verbally—just like in a real interview setting."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 3-day free trial so you can explore the platform and practice cases before committing to a subscription."
  },
  {
    question: "How do I track my progress?",
    answer: "Your dashboard shows completed cases, scores, and improvement trends over time. You can see which areas need more practice and celebrate your wins."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about CaseForesight
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
