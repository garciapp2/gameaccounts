import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PageHeader = ({ title, buttonText, onButtonClick, showButton = true }) => {
  return (
    <Box className="page-header">
      <Typography variant="h5" component="h1" gutterBottom>
        {title}
      </Typography>
      {showButton && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
        >
          {buttonText || 'Adicionar'}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 