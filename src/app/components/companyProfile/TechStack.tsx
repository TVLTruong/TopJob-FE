'use client';
import React from 'react';

export default function TechStack() {
  const techStack = [
    { name: 'HTML 5', color: 'bg-orange-500' },
    { name: 'CSS 3', color: 'bg-blue-500' },
    { name: 'JavaScript', color: 'bg-yellow-500' },
    { name: 'React', color: 'bg-cyan-400' },
    { name: 'Vue', color: 'bg-green-500' },
    { name: 'Next JS', color: 'bg-gray-900' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Công nghệ</h3>
      <div className="grid grid-cols-2 gap-3">
        {techStack.map((tech, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${tech.color}`}></div>
            <span className="text-gray-700">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
