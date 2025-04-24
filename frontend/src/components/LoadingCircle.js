import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingCircle = ({ size = 40 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingCircle; 