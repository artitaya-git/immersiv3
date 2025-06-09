declare namespace JSX {
    interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src?: string;
            alt?: string;
            
            // AR attributes
            ar?: boolean;
            'ar-status'?: string;
            'ar-modes'?: string; // "webxr scene-viewer quick-look"
            'ar-scale'?: string; // "auto" | "fixed"
            'ios-src'?: string; // USDZ file for iOS
            
            'camera-controls'?: boolean;
            'auto-rotate'?: boolean;
            'auto-rotate-delay'?: string | number;
            'rotation-per-second'?: string;
            
            loading?: 'auto' | 'lazy' | 'eager';
            reveal?: 'auto' | 'interaction' | 'manual';
            'touch-action'?: string;
            
            // Visual enhancements
            'tone-mapping'?: 'auto' | 'aces' | 'filmic' | 'neutral' | 'commerce';
            'shadow-intensity'?: string | number;
            'shadow-softness'?: string | number;
            'environment-image'?: string;
            exposure?: string | number;
            
            // Poster and loading state
            poster?: string;
            'seamless-poster'?: boolean;
            
            'animation-name'?: string;
            'animation-crossfade-duration'?: string | number;
            autoplay?: boolean;
            
            'disable-zoom'?: boolean;
            'disable-pan'?: boolean;
            'disable-tap'?: boolean;
            'interaction-policy'?: 'always-allow' | 'allow-when-focused' | 'when-focused';
            
            'variant-name'?: string;
            
            slot?: string;
            
            // Events 
            'on-load'?: string;
            'on-error'?: string;
            'on-ar-status'?: string;
            'on-camera-change'?: string;
        };
    }
}