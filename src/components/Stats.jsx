import React from 'react';
import { statsContent } from '../data/statsContent';

function Stats() {
  return (
    <section className={statsContent.sectionClass}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {statsContent.stats.map((stat, index) => (
            <div key={index} className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">{stat.value}</div>
              <div className="text-zinc-400">{stat.label}</div>
              {stat.description && (
                <div className="text-sm text-zinc-500 mt-1">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
