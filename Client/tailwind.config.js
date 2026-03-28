export default {
    theme: {
        extend: {
            keyframes: {
                fadeUp: {
                    '0%': { opacity: 0, transform: 'translateY(28px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                badgePop: {
                    '0%': { opacity: 0, transform: 'scale(0.88)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                btnShine: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                fadeUp: 'fadeUp 0.5s ease-out',
                badgePop: 'badgePop 0.3s ease-out',
                shimmer: 'shimmer 2s linear infinite',
                btnShine: 'btnShine 1.5s linear infinite',
            },
        },
    },
};