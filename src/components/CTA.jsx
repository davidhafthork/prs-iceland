import React from 'react';
import { Users } from 'lucide-react';

function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Tilbúinn að keppa?</h2>
        <p className="text-xl mb-8 text-zinc-100">
          Vertu hluti af fremstu nákvæmnisskotfélagi Íslands
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center">
            <Users className="mr-2 h-4 w-4" />
            Gerast félagi
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-md font-medium transition-colors">
            Fræðast meira
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;
