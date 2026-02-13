"use client";

import React from 'react';

type Props = {
  active: boolean;
  mode: 'out-left' | 'in-right';
  onEnd?: () => void;
};

export default function CurtainTransition({ active, mode, onEnd }: Props) {
  if (!active) return null;

  const animation = mode === 'out-left' 
    ? 'curtain-out-left 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards'
    : 'curtain-in-right 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards';

  return (
    <div 
      className="curtain-overlay"
      style={{ animation }}
      onAnimationEnd={onEnd}
    />
  );
}
