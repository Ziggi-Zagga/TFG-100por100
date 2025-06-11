export const classes = {
	primary: `w-full rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500 py-3 font-semibold text-white transition
    focus:ring-2 focus:ring-indigo-500 focus:outline-none
    shadow-md
    hover:bg-gradient-to-br hover:from-cyan-600 hover:via-indigo-700 hover:to-purple-800`,
	secondary: `bg-white text-gradient-end border border-gradient-middle
    hover:bg-gradient-middle/10 hover:text-gradient-middle
    focus:ring-2 focus:ring-gradient-middle focus:outline-none`,
	tertiary: `bg-gray-100 text-gray-700 border border-gray-300
    hover:bg-gray-200 hover:text-gradient-end
    focus:ring-2 focus:ring-gradient-middle focus:outline-none`,
	quarternary: `bg-transparent text-gradient-end border border-transparent
    hover:bg-gradient-end/10 hover:text-gradient-middle
    focus:ring-2 focus:ring-gradient-middle focus:outline-none`
};

export const sizes = {
	sm: 'text-xs px-3 py-1.5',
	md: 'text-sm px-5 py-2.5',
	lg: 'text-base px-7 py-3'
};

export const animations = {
	spin: 'animate-spin'
};
