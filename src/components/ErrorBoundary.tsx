import React from 'react';
import { LogoMark } from './Logo';
import { sound } from '../audio/sound';

// Catches render errors anywhere below, shows a calm branded fallback.
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('No Debates crashed:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="relative inline-block">
            <LogoMark className="w-14 h-14 mx-auto" />
            <span className="absolute -top-1 -right-2 text-[13px]">•</span>
          </div>
          <h1 className="font-display font-black tracking-tight text-2xl text-ink-900 mt-4">
            Something went wrong
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed mt-2">
            The app hit an unexpected snag. Reloading usually fixes it — your spins and history are saved on this device.
          </p>
          <button
            onClick={() => {
              sound.tap();
              window.location.reload();
            }}
            className="btn-primary mt-6 px-7 h-11 text-sm"
          >
            Reload the app
          </button>
        </div>
      </div>
    );
  }
}