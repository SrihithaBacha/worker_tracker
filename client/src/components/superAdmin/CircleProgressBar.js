import React from 'react';
//import './CircleProgressBar.css'; // Add custom styles for positioning

const CircleProgressBar = ({ size, progress, strokeWidth }) => {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size}>
            {/* Background Circle */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="lightgray"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* Progress Circle */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="green"  // Green color for progress
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-dashoffset 0.35s',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                }}
            />
            {/* Text Progress */}
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="20px"
                fill="black"
            >
                {`${progress}%`}
            </text>
        </svg>
    );
};

export default CircleProgressBar;
