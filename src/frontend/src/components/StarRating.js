import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';

const StarRating = ({ 
  rating = 0, 
  count = 0, 
  size = 'medium', 
  interactive = false, 
  onRate = null,
  showCount = true,
  precision = 0.5 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleStarClick = (value) => {
    if (!interactive || !onRate) return;
    
    setCurrentRating(value);
    onRate(value);
  };

  const handleStarHover = (value) => {
    if (!interactive) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const getStarIcon = (starIndex) => {
    const displayRating = hoverRating || currentRating;
    const filled = starIndex <= displayRating;
    
    if (precision === 0.5 && starIndex - 0.5 === displayRating) {
      // Yarım yıldız için özel durum
      return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <StarBorderIcon 
            sx={{ 
              color: 'action.disabled',
              fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 24 
            }} 
          />
          <StarIcon 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#ffc107',
              fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 24,
              clipPath: 'inset(0 50% 0 0)'
            }} 
          />
        </Box>
      );
    }

    return filled ? (
      <StarIcon 
        sx={{ 
          color: '#ffc107',
          fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 24 
        }} 
      />
    ) : (
      <StarBorderIcon 
        sx={{ 
          color: 'action.disabled',
          fontSize: size === 'small' ? 16 : size === 'large' ? 32 : 24 
        }} 
      />
    );
  };

  const formatRating = (value) => {
    return Number(value).toFixed(1);
  };

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Box display="flex" alignItems="center" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          interactive ? (
            <Tooltip key={star} title={`${star} yıldız`} arrow>
              <IconButton
                size="small"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                sx={{ 
                  p: 0.25,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {getStarIcon(star)}
              </IconButton>
            </Tooltip>
          ) : (
            <Box key={star} sx={{ display: 'inline-flex' }}>
              {getStarIcon(star)}
            </Box>
          )
        ))}
      </Box>
      
      {showCount && (
        <Typography 
          variant={size === 'small' ? 'caption' : 'body2'} 
          color="text.secondary"
          sx={{ ml: 0.5 }}
        >
          {currentRating > 0 ? (
            <>
              {formatRating(currentRating)}
              {count > 0 && ` (${count})`}
            </>
          ) : (
            count > 0 ? `(${count})` : 'Henüz puanlanmadı'
          )}
        </Typography>
      )}
    </Box>
  );
};

// Sadece gösterim için basit yıldız component'i
export const SimpleStarRating = ({ rating = 0, count = 0, size = 'small' }) => {
  return (
    <StarRating 
      rating={rating} 
      count={count} 
      size={size} 
      interactive={false} 
      showCount={true}
    />
  );
};

// Interaktif rating component'i
export const InteractiveStarRating = ({ rating = 0, onRate, size = 'medium' }) => {
  return (
    <StarRating 
      rating={rating} 
      size={size} 
      interactive={true} 
      onRate={onRate}
      showCount={false}
    />
  );
};

export default StarRating; 