import Shell from '@/components/layout/Shell';
import Contact from '@/components/sections/ContactSection';

export const metadata = {
  title: 'Contact — LuxSync',
  description: 'Get in touch with the LuxSync team.',
};

export default function ContactPage() {
  return (
    <Shell>
      <Contact />
    </Shell>
  );
}
