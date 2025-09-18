import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../app/costants';

export default function DailyCountdown() {
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`//:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight
    
    return midnight.getTime() - now.getTime();
  };


  useEffect(() => {
    const updateTimer = () => {
      const midnightTime = calculateTimeUntilMidnight();
      
      if (midnightTime > 0) {
        setTimeUntilMidnight(formatTime(midnightTime));
      } else {
        setTimeUntilMidnight('00:00:00');
      }
      
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (

    <Text style={{ fontFamily: FONTS.BODY, 
            color: COLORS.CYAN, fontSize: 14}}> 
        {timeUntilMidnight}
    </Text>

  );
};


export function WeeklyCountdown() {

    const [timeUntilWeekEnd, setTimeUntilWeekEnd] = useState('');

    const formatDaysTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        if (days > 0) {
        return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`//:${seconds.toString().padStart(2, '0')}`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`//:${seconds.toString().padStart(2, '0')}`;
  
    }

    const calculateTimeUntilWeekEnd = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
        // Calculate days until Saturday (6)
        let daysUntilSaturday;
        if (currentDay === 6) {
        // If it's already Saturday, check if we're past midnight
        daysUntilSaturday = 0;
        } else if (currentDay === 0) {
        // If it's Sunday, Saturday is 6 days away
        daysUntilSaturday = 6;
        } else {
        // For Monday-Friday, calculate days to Saturday
        daysUntilSaturday = 6 - currentDay;
        }
        
        const nextSaturday = new Date();
        nextSaturday.setDate(now.getDate() + daysUntilSaturday);
        nextSaturday.setHours(24, 0, 0, 0); // Saturday at midnight (technically Sunday 00:00)
        
        return nextSaturday.getTime() - now.getTime();
    };

    useEffect(() => {
    const updateTimer = () => {
      const weekEndTime = calculateTimeUntilWeekEnd();
      
      if (weekEndTime > 0) {
        setTimeUntilWeekEnd(formatDaysTime(weekEndTime));
      } else {
        setTimeUntilWeekEnd('00:00:00');
      }
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
        <Text style={{ fontFamily: FONTS.BODY, color: COLORS.CYAN, fontSize: 14}}>
            {timeUntilWeekEnd}
        </Text>
  )
}
