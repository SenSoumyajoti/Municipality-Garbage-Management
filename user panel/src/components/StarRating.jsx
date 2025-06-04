import React, { useState } from 'react';

const StarRating = () => {
  const [rating, setRating] = useState(0);       // Current selected rating
  const [hover, setHover] = useState(0);         // Hovered star index

  return (
    <div className='flex gap-1 text-4xl cursor-pointer'>
        {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
            <span
                key={starValue}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                style={{ color: starValue <= (hover || rating) ? '#009600' : '#babcc7' }}
            >
                ★
            </span>
            );
        })}
    </div>
  );
};

export default StarRating;